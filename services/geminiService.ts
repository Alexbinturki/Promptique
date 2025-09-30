import { GoogleGenAI, Modality } from "@google/genai";
import type { Gender } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable is not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Analyzes a reference image and creates a detailed prompt adapted for a specified gender and age.
 * @param referenceImageBase64 - The base64 encoded reference image.
 * @param userGender - The target gender ('male' or 'female').
 * @param userAge - The target age.
 * @returns A promise that resolves to the generated prompt string.
 */
export const createPromptFromReference = async (
  referenceImageBase64: string,
  userGender: Gender,
  userAge: number
): Promise<string> => {
  const model = 'gemini-2.5-flash';
  const prompt = `You are an expert prompt engineer for AI image generation. Your task is to analyze the provided reference image and create a new, detailed prompt.

**Your Goal**: Generate a prompt that captures the *entire essence, style, and technical photographic details* of the reference image, but adapted for a person of gender: '${userGender}' and age: approximately ${userAge} years old. Intelligently adapt gender-specific and age-specific details (like clothing and context) to fit a '${userGender}' around ${userAge} years old, while keeping the theme, mood, composition, and all technical details identical.

**Crucial Rule**: You MUST NOT describe the person's facial features, hair style, or hair color. The final image will use the user's own face and hair, so these details MUST be omitted from the prompt to avoid conflicts. Focus exclusively on the elements listed below.

**Style Lexicon for Inspiration**: Use these terms to identify the style of the reference image.
*   **Artistic Styles**: Realistic Portrait, Hyperrealism Style, Oil Painting Style, Watercolor Style, Pencil Sketch, Charcoal Drawing, Ink Illustration, Pop Art (Andy Warhol style), Impressionism (Monet style), Surrealism (Dali style), Cubism (Picasso style), Minimalist Line Art, Abstract Art Portrait, Graffiti / Street Art Style, Digital Painting.
*   **Photography Styles**: Cinematic Style, Vintage Film Photography, Black & White Classic, Sepia Tone, Polaroid Instant Photo, 35mm Film Grain, High Fashion Editorial Photography, Glamour Portrait, Studio Flash Portrait, Natural Light Photography, Overexposed / Dreamy Photography, Dark Moody Portrait, Golden Hour Photography, Candid Lifestyle Shot, Street Photography Style.
*   **Cultural & Historical Styles**: Medieval Knight Style, Samurai Warrior Style, Ancient Egyptian Style, Roman Gladiator Style, Viking Style, Renaissance Painting Style, Victorian Era Portrait, 1920s Gatsby Style, 1950s Vintage Americana, 1980s Retro Neon Style, Cyberpunk Character, Steampunk Character, Arabian Traditional Style, African Tribal Style, Native American Style.
*   **Fantasy & Sci-Fi Styles**: Elf / Fairytale Character, Orc / Fantasy Creature, Vampire Gothic Style, Werewolf Hybrid Style, Wizard / Sorcerer, Futuristic Cyborg, Alien Humanoid, Space Marine / Astronaut, Post-Apocalyptic Survivor, Mutant Character, Robot / Android, Hologram Style Character, Virtual Reality Avatar, Superhero Comic Style, Supervillain Dark Style.
*   **Cartoon & Animation Styles**: Disney Pixar Style, DreamWorks Animation Style, Anime (Shonen Style), Manga Black & White, Chibi Cute Style, Studio Ghibli Style, Cartoon Network Style, Simpsons Style, South Park Style, 2D Vector Art Character, 3D CGI Character, Claymation Style (Wallace & Gromit look), Lego Character Style, Funko Pop Doll Style, Video Game Avatar Style.
*   **Creative / Conceptual Styles**: Double Exposure Portrait, Holographic Glitch Effect, Pixel Art Style, Low Poly 3D Art, Neon Glow Effect, Vaporwave Aesthetic, Synthwave Retro, Fire & Smoke Portrait, Ice & Crystal Effect, Gold / Bronze Statue Style, Marble Sculpture Style, Paper Cutout Portrait, Origami Style, Tattoo Art Style, Graffiti Spray Effect.
*   **Experimental Styles**: Upside Down Portrait, Distorted Abstract Face, Mirror Reflection Character, Fragmented Glass Effect, Hologram Wireframe Style, Infrared Heat Map Portrait, X-ray Skeleton Effect, Pop Surrealism (Weird Cartoon Mix), Collage / Mixed Media Portrait, Dreamlike AI-Generated Fantasy Style.

**Elements to Analyze**:
1.  **Core Style**: Identify the primary artistic and thematic style. Refer to the **Style Lexicon** above for inspiration and to find the most accurate terms. (e.g., Cinematic Portrait, Classic Studio Portrait, Environmental Portrait, Candid Portrait, Editorial Portrait, Lifestyle Portrait, Fashion Portrait, Conceptual Portrait, Character Study, Photorealistic, Watercolor, Oil Painting, etc.)
2.  **Subject Description**:
    *   **Action/Pose**: Describe the character's movement, stance, form, and posture.
    *   **Clothing**: Provide a detailed description of all clothes, fabrics, colors, and style.
    *   **Accessories**: Mention any jewelry, hats, glasses, or objects they are holding.
3.  **Scene & Environment**:
    *   **Location**: (e.g., Indoor studio, Outdoor, on a mountain, at the sea, cityscape, abstract background.)
    *   **Background Details**: Describe the immediate background elements and their arrangement.
    *   **Atmospheric Effects**: Note any environmental effects like fog, smoke, rain, or particles.
4.  **Photographic & Cinematic Technique**:
    *   **Framing & Shot Size**: Analyze and choose the most fitting term: Extreme Close-Up (ECU), Close-Up (CU), Medium Close-Up (MCU), Medium Shot (MS), Medium Long Shot (MLS), Full Shot (FS), Long Shot (LS).
    *   **Camera Angle**: Identify the specific camera angle used. Choose from: Eye Level, High Angle, Low Angle, Over-the-Shoulder (OTS), Point of View (POV), Dutch Angle, Profile Shot (Side View), Overhead / Bird’s Eye, Worm’s Eye View, Crane Shot, Tilt Shot, Pan Shot.
    *   **Camera Lens**: Infer the type of lens used. Describe it based on these categories:
        *   **By Focal Length**: Standard/Normal Lens (35mm-70mm), Wide-Angle Lens (14mm-35mm), Ultra-Wide Lens (10mm-20mm), Fish-Eye Lens (8mm-16mm), Telephoto Lens (70mm-200mm), Super Telephoto Lens (200mm+), Macro Lens. Note if it appears to be a Prime Lens (fixed focal length) or a Zoom Lens (variable).
        *   **By Aperture Effects**: Mention if it looks like a Fast Lens (e.g., f/1.4) due to a shallow depth of field and significant background blur (bokeh), or a Slow Lens (e.g., f/4+) if most of the scene is in focus.
        *   **By Special Use / Effects**: Anamorphic Lens (cinematic aspect ratio, distinctive lens flare), Soft Focus Lens (dreamy look), Tilt-Shift Lens (miniature effect), Cine Lens (cinematic color/contrast).
    *   **Lighting Style & Technique**: Describe the lighting (Natural or artificial, warm or cold, its color, type, direction). Identify any specific named styles used: Rembrandt Lighting, Butterfly Lighting, Split Lighting, Loop Lighting, Backlighting / Rim Light, Silhouette.
    *   **Creative Effects**: Mention if any experimental techniques are used: Double Exposure, Reflections Portrait, Through the Object Shot, Motion Blur, Black & White Portrait, Colored Gel Lighting, Close-Up Distortion (Wide Lens Portrait).

**Output Format**: The final output must be a single, cohesive, comma-separated string in English, ready to be used in an AI image generator. Do not add any explanation or preamble. For example: "Cinematic Portrait, Medium Shot, Low Angle, captured with a 35mm f/1.4 prime lens creating a shallow depth of field, photorealistic portrait of a ${userGender} around ${userAge} years old, wearing a detailed leather jacket, Rembrandt lighting, standing on a neon-lit city street at night, dramatic backlighting."`;

  const response = await ai.models.generateContent({
    model,
    contents: {
      parts: [
        {
          inlineData: {
            mimeType: 'image/jpeg',
            data: referenceImageBase64,
          },
        },
        { text: prompt },
      ],
    },
  });

  return response.text.trim();
};

/**
 * Generates a final image by combining a user's photo with a descriptive prompt.
 * @param userImageBase64 - The base64 encoded user image.
 * @param finalPrompt - The descriptive prompt for the final image.
 * @returns A promise that resolves to the base64 encoded string of the generated image.
 */
export const generateFinalImage = async (
  userImageBase64: string,
  finalPrompt: string
): Promise<string> => {
  const model = 'gemini-2.5-flash-image-preview';
  const instruction = `Strictly preserve the exact facial features, hair style, and hair color from the provided user image. Do not alter them. Place this person into a new photorealistic scene based on the following description, adapting only their body and clothing to match: ${finalPrompt}`;

  const response = await ai.models.generateContent({
    model,
    contents: {
      parts: [
        {
          inlineData: {
            data: userImageBase64,
            mimeType: 'image/jpeg',
          },
        },
        {
          text: instruction,
        },
      ],
    },
    config: {
      responseModalities: [Modality.IMAGE, Modality.TEXT],
    },
  });

  for (const part of response.candidates[0].content.parts) {
    if (part.inlineData) {
      return part.inlineData.data;
    }
  }

  throw new Error("Image generation failed: no image data received from the API.");
};