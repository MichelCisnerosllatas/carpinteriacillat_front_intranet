// /shared/types/api.ts
export interface ApiResponse<T> {
  success: boolean; // ✅ estándar: true/false siempre
  status: number;   // ✅ 201, 200, 422, 500 o 0 (sin respuesta)
  message: string;  // ✅ mensaje para UI
  data?: T;         // ✅ solo en éxito normalmente
  errors?: Record<string, string[]> | null; // ✅ validaciones (Laravel)
}


// // Tipo genérico para manejar cualquier respuesta de API controlada
// export interface ApiResponse<T> {
//   status: boolean;          // si la petición fue exitosa
//   code: number;            // código HTTP
//   message: string;           // mensaje de backend o personalizado
//   data?: T;                  // datos opcionales (por ejemplo, results)
//   errors?: Record<string, string[]> | null; //Para soportar los errores del backend
// }