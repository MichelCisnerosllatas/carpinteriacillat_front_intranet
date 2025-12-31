// Archivo: src/features/auth/model/facultadEntities.ts
// ============================================
// Tipos de TypeScript para Autenticación
// ============================================


// ==============================
// Estructura general del backend
// ==============================
export interface ApiResult<T> {
    result: {
        success: boolean;
        message: string;
        data: T;
    };
}

// ==============================
// Tipos del usuario
// ==============================
export interface UserAuthData {
    IdUsuario: string;
    IdPersona: string;
    IdUserEmpresa: string;
    IdEmpresa: string;
    IdRol: string;
    Rol: string;
    Nombre: string;
    Apellido: string;
    NombreCompleto: string;
    Correo: string;
    IdTipoDoc: string;
    TipoDoc: string;
    NumDoc: string;
    Login: string;
    NombreEmpresa: string;
    RutaImagen: string;
    FechaRegistro: string;
    HoraRegistro: string;
    FechaModifica: string;
    HoraModifica: string;
    Estado: string;
    Empresa: Empresa[];
    Celular: Celular[];
    Direccion: null; // ⚠️ tu backend envía un array, no un string
}

export interface Celular {
    IdPersonaCelular: string;
    IdPersona: string;
    IdPais: string;
    RutaBandera: string;
    Cod: string;
    Cel: string;
    Celular: string;
    Estado: string;
    FechaRegistro: string;
    HoraRegistro: string;
}

export interface Empresa {
    IdUserEmpresa: string;
    IdEmpresa: string | null;
    NombreEmpresa: string | null;
    Identificacion: string | null;
    IdPais: string | null;
    IdDepartamento: string | null;
    IdProvincia: string | null;
    IdDistrito: string | null;
    pais: string | null;
    departamento: string | null;
    provincia: string | null;
    distrito: string | null;
    Direccion: string | null;
    Estado: string | null;
    FechaRegistro: string | null;
    FechaModifica: string | null;
}





// ============================================
// Credenciales de Login
// ============================================
export interface LoginCredentials {
    email: string;
    password: string;
}

// ============================================
// Datos de Registro
// ============================================
export interface RegistroData {
    nombre: string;
    apellido: string;
    email: string;
    password: string;
    telefono?: string;
}

// ============================================
// Estado de Autenticación (para Zustand)
// ============================================
export interface AuthState {
    // Estado
    user: UserAuthData | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;

    // Acciones
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
    checkAuth: () => Promise<void>;
    clearError: () => void;
    setUser: (user: UserAuthData | null) => void;
}