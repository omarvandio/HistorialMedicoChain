import { MedicalFile } from './types';

// TODO: Configurar Google Gemini API
// 1. Obtener API Key de: https://makersuite.google.com/app/apikey
// 2. Agregar a variables de entorno: VITE_GEMINI_API_KEY
// 3. Descomentar la función real abajo

export const analyzeFileWithAI = async (file: MedicalFile): Promise<string> => {
  // SIMULACIÓN - Reemplazar con llamada real a Gemini API
  return new Promise((resolve) => {
    setTimeout(() => {
      const analysis = `
📊 Análisis de ${file.name}

🔍 Tipo de archivo: ${file.type}
📅 Fecha de carga: ${new Date(file.uploadDate).toLocaleDateString()}
💾 Tamaño: ${(file.size / 1024).toFixed(2)} KB

✅ Análisis simulado completado
⚠️ Configurar Gemini API para análisis real

Para configurar:
1. Obtener API Key de Google AI Studio
2. Agregar VITE_GEMINI_API_KEY a .env
3. Descomentar función real en src/lib/ai.ts
      `.trim();
      
      resolve(analysis);
    }, 2000);
  });
  
  /* 
  // FUNCIÓN REAL PARA GEMINI API (descomentar cuando tengas la API Key)
  
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  
  if (!apiKey) {
    throw new Error('VITE_GEMINI_API_KEY no configurada');
  }

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `Analiza este archivo médico: ${file.name}. Proporciona un análisis detallado.`
          }]
        }]
      })
    }
  );

  const data = await response.json();
  return data.candidates[0].content.parts[0].text;
  */
};
