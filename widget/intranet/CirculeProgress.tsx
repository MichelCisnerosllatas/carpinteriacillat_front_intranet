export default function CirculeProgress() {
    return (
        <div className="w-full h-[calc(100vh-160px)] flex items-center justify-center bg-app-2">
            {/* círculo giratorio */}
            <div className="w-12 h-12 border-4 border-t-gray-300 border-blue-500 rounded-full animate-spin"></div>
        </div>
    );
}