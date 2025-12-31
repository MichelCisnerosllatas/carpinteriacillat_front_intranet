// Tipo genérico para manejar cualquier respuesta de API controlada
export interface ApiResponse<T> {
  status: boolean;          // si la petición fue exitosa
  code: number;            // código HTTP
  message: string;           // mensaje de backend o personalizado
  data?: T;                  // datos opcionales (por ejemplo, results)
  errors?: Record<string, string[]> | null; //Para soportar los errores del backend
}