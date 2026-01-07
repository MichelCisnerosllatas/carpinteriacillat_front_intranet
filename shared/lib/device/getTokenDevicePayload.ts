// /shared/lib/device/getTokenDevicePayload.ts
import * as UAParser from 'ua-parser-js'
import {TokenDeviceRegisterProps} from "@/features/tokendevice/type/TokenDeviceRegisterProps";

const DEVICE_ID_KEY = 'tokendevice_device_id'

function getOrCreateDeviceId(): string {
    if (typeof window === 'undefined') return 'server'

    const existing = localStorage.getItem(DEVICE_ID_KEY)
    if (existing) return existing

    const id =
        typeof crypto !== 'undefined' && 'randomUUID' in crypto
            ? crypto.randomUUID()
            : `web-${Math.random().toString(16).slice(2)}-${Date.now()}`

    localStorage.setItem(DEVICE_ID_KEY, id)
    return id
}

function detectDeviceType(): string {
    // ua-parser-js en web suele devolver device vacío
    // así que lo hacemos por pantalla (simple y efectivo)
    if (typeof window === 'undefined') return 'server'
    const w = window.innerWidth

    if (w < 768) return 'mobile'
    if (w < 1024) return 'tablet'
    return 'desktop'
}

export function getTokenDevicePayload(): TokenDeviceRegisterProps {
    const ua = typeof navigator !== 'undefined' ? navigator.userAgent : ''
    const parser = new UAParser.UAParser(ua)
    const { browser, os } = parser.getResult()

    const browserName = browser?.name ?? 'Unknown'
    const browserVersion = browser?.version ?? 'Unknown'
    const osName = os?.name ?? 'Unknown'
    const osVersion = os?.version ?? 'Unknown'

    const deviceType = detectDeviceType()
    const deviceId = getOrCreateDeviceId()

    // No existe "PC Oficina" real en web. Esto es lo normal:
    const deviceName = `Web - ${browserName} (${deviceType})`

    return {
        platform: 'web',
        device_type: deviceType,
        device_id: deviceId,
        device_name: deviceName,
        os_name: osName,
        os_version: osVersion,
        browser_name: browserName,
        browser_version: browserVersion,
    }
}

export async function getTokenDevicePayloadPro() {
    const ua = typeof navigator !== 'undefined' ? navigator.userAgent : ''
    const parser = new UAParser.UAParser(ua)
    const res = parser.getResult()

    // defaults por UA
    let os_name = res.os?.name ?? 'Unknown'
    let os_version = res.os?.version ?? 'Unknown'
    let browser_name = res.browser?.name ?? 'Unknown'
    let browser_version = res.browser?.version ?? 'Unknown'
    let device_type: 'mobile' | 'tablet' | 'desktop' = 'desktop'

    // ✅ mejora con UA-CH si está disponible
    const uaData = (navigator as any).userAgentData
    if (uaData) {
        device_type = uaData.mobile ? 'mobile' : 'desktop'
        os_name = uaData.platform || os_name

        try {
            const h = await uaData.getHighEntropyValues([
                'platformVersion',
                'fullVersionList',
            ])

            if (h.platformVersion) {
                os_version =
                    os_name === 'Windows'
                        ? normalizeWindowsVersion(os_name, h.platformVersion)
                        : h.platformVersion
            }

            const brands = h.fullVersionList || []
            const best = brands.find((b: any) => !/Not.*A.*Brand/i.test(b.brand))
            if (best) {
                browser_name = best.brand
                browser_version = best.version
            }
        } catch {}
    }


    const device_id =
        localStorage.getItem('tokendevice_device_id') ||
        (crypto.randomUUID ? crypto.randomUUID() : `web-${Date.now()}`)
    localStorage.setItem('tokendevice_device_id', device_id)

    const device_name = `Web - ${browser_name} (${device_type})`

    return {
        platform: 'web',
        device_type,
        device_id,
        device_name,
        os_name,
        os_version,
        browser_name,
        browser_version,
    }
}

function normalizeWindowsVersion(osName: string, platformVersion: string) {
    if (osName !== 'Windows') return platformVersion

    const major = parseInt(platformVersion.split('.')[0], 10)

    // Windows 11 moderno
    if (major >= 13) return '11'

    // Windows 10
    return '10'
}

