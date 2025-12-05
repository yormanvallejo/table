import { Level } from './types';

// Images from picsum or placeholders
const IMG_BASE = "https://picsum.photos/seed";

export const LEVELS: Level[] = [
  {
    id: 'level-1',
    title: 'Nivel 1: Las Vocales',
    description: 'Aprende las vocales con imágenes.',
    color: 'bg-kid-blue',
    items: [
      { id: 'l1-1', type: 'vowel', text: 'a', image: `${IMG_BASE}/airplane/300/300`, syllables: ['a'] },
      { id: 'l1-2', type: 'vowel', text: 'e', image: `${IMG_BASE}/elephant/300/300`, syllables: ['e'] },
      { id: 'l1-3', type: 'vowel', text: 'i', image: `${IMG_BASE}/church/300/300`, syllables: ['i'] },
      { id: 'l1-4', type: 'vowel', text: 'o', image: `${IMG_BASE}/bear/300/300`, syllables: ['o'] },
      { id: 'l1-5', type: 'vowel', text: 'u', image: `${IMG_BASE}/grapes/300/300`, syllables: ['u'] },
    ]
  },
  {
    id: 'level-2',
    title: 'Nivel 2: Sílabas (M)',
    description: 'Palabras con Ma, Me, Mi, Mo, Mu.',
    color: 'bg-kid-pink',
    items: [
      { id: 'l2-1', type: 'word', text: 'mamá', syllables: ['ma', 'má'], image: `${IMG_BASE}/mom/300/300` },
      { id: 'l2-2', type: 'word', text: 'ama', syllables: ['a', 'ma'] },
      { id: 'l2-3', type: 'word', text: 'mami', syllables: ['ma', 'mi'] },
      { id: 'l2-4', type: 'word', text: 'amo', syllables: ['a', 'mo'] },
      { id: 'l2-5', type: 'word', text: 'mima', syllables: ['mi', 'ma'] },
      { id: 'l2-6', type: 'word', text: 'eme', syllables: ['e', 'me'] },
      { id: 'l2-7', type: 'word', text: 'memo', syllables: ['me', 'mo'] },
      { id: 'l2-8', type: 'word', text: 'mimo', syllables: ['mi', 'mo'] },
      { id: 'l2-9', type: 'word', text: 'mío', syllables: ['mí', 'o'] },
      { id: 'l2-10', type: 'word', text: 'ame', syllables: ['a', 'me'] },
      { id: 'l2-11', type: 'word', text: 'mía', syllables: ['mí', 'a'] },
      { id: 'l2-12', type: 'word', text: 'miau', syllables: ['miau'] },
    ]
  },
  {
    id: 'level-3',
    title: 'Nivel 3: Frases',
    description: 'Leyendo oraciones completas.',
    color: 'bg-kid-green',
    items: [
      { id: 'l3-1', type: 'sentence', text: 'amo a mi mamá', words: ['amo', 'a', 'mi', 'mamá'], image: `${IMG_BASE}/lovemom/400/200` },
      { id: 'l3-2', type: 'sentence', text: 'mi mamá me ama', words: ['mi', 'mamá', 'me', 'ama'] },
      { id: 'l3-3', type: 'sentence', text: 'mimo a mi mamá', words: ['mimo', 'a', 'mi', 'mamá'] },
      { id: 'l3-4', type: 'sentence', text: 'mi mamá me mima', words: ['mi', 'mamá', 'me', 'mima'] },
    ]
  },
  {
    id: 'level-4',
    title: 'Nivel 4: Sílabas (P)',
    description: 'Palabras con Pa, Pe, Pi, Po, Pu.',
    color: 'bg-kid-purple',
    items: [
      // Sílabas con imágenes (Fila superior)
      { id: 'l4-s1', type: 'word', text: 'pa', syllables: ['pa'], image: `${IMG_BASE}/father/300/300` },
      { id: 'l4-s2', type: 'word', text: 'pe', syllables: ['pe'], image: `${IMG_BASE}/ball/300/300` },
      { id: 'l4-s3', type: 'word', text: 'pi', syllables: ['pi'], image: `${IMG_BASE}/pineapple/300/300` },
      { id: 'l4-s4', type: 'word', text: 'po', syllables: ['po'], image: `${IMG_BASE}/chick/300/300` },
      { id: 'l4-s5', type: 'word', text: 'pu', syllables: ['pu'], image: `${IMG_BASE}/fist/300/300` },
      
      // Palabras del texto
      { id: 'l4-1', type: 'word', text: 'papá', syllables: ['pa', 'pá'] },
      { id: 'l4-2', type: 'word', text: 'mopa', syllables: ['mo', 'pa'] },
      { id: 'l4-3', type: 'word', text: 'popa', syllables: ['po', 'pa'] },
      
      { id: 'l4-4', type: 'word', text: 'papi', syllables: ['pa', 'pi'] },
      { id: 'l4-5', type: 'word', text: 'pepe', syllables: ['pe', 'pe'] },
      { id: 'l4-6', type: 'word', text: 'pipa', syllables: ['pi', 'pa'] },
      
      { id: 'l4-7', type: 'word', text: 'pepa', syllables: ['pe', 'pa'] },
      { id: 'l4-8', type: 'word', text: 'mapa', syllables: ['ma', 'pa'] },
      { id: 'l4-9', type: 'word', text: 'púa', syllables: ['pú', 'a'] },
      
      { id: 'l4-10', type: 'word', text: 'pío', syllables: ['pí', 'o'] },
      { id: 'l4-11', type: 'word', text: 'pía', syllables: ['pí', 'a'] },
      { id: 'l4-12', type: 'word', text: 'puma', syllables: ['pu', 'ma'] },
    ]
  },
  {
    id: 'level-5',
    title: 'Nivel 5: Sílabas (L)',
    description: 'Palabras con La, Le, Li, Lo, Lu.',
    color: 'bg-kid-orange',
    items: [
      // Sílabas con imágenes
      { id: 'l5-s1', type: 'word', text: 'la', syllables: ['la'], image: `${IMG_BASE}/pencil/300/300` },
      { id: 'l5-s2', type: 'word', text: 'le', syllables: ['le'], image: `${IMG_BASE}/milk/300/300` },
      { id: 'l5-s3', type: 'word', text: 'li', syllables: ['li'], image: `${IMG_BASE}/lemon/300/300` },
      { id: 'l5-s4', type: 'word', text: 'lo', syllables: ['lo'], image: `${IMG_BASE}/wolf/300/300` },
      { id: 'l5-s5', type: 'word', text: 'lu', syllables: ['lu'], image: `${IMG_BASE}/moon/300/300` },
      
      // Palabras del texto
      { id: 'l5-1', type: 'word', text: 'loma', syllables: ['lo', 'ma'] },
      { id: 'l5-2', type: 'word', text: 'lima', syllables: ['li', 'ma'] },
      { id: 'l5-3', type: 'word', text: 'lame', syllables: ['la', 'me'] },
      { id: 'l5-4', type: 'word', text: 'lomo', syllables: ['lo', 'mo'] },
      
      { id: 'l5-5', type: 'word', text: 'malo', syllables: ['ma', 'lo'] },
      { id: 'l5-6', type: 'word', text: 'mula', syllables: ['mu', 'la'] },
      { id: 'l5-7', type: 'word', text: 'pelo', syllables: ['pe', 'lo'] },
      { id: 'l5-8', type: 'word', text: 'pila', syllables: ['pi', 'la'] },
      
      { id: 'l5-9', type: 'word', text: 'paloma', syllables: ['pa', 'lo', 'ma'] },
      { id: 'l5-10', type: 'word', text: 'pomelo', syllables: ['po', 'me', 'lo'] },

      { id: 'l5-11', type: 'word', text: 'lola', syllables: ['lo', 'la'] },
      { id: 'l5-12', type: 'word', text: 'lalo', syllables: ['la', 'lo'] },
      
      // Frase
      { 
        id: 'l5-13', 
        type: 'sentence', 
        text: 'lola asea la sala', 
        words: ['lola', 'asea', 'la', 'sala'],
        syllables: ['lo', 'la', ' ', 'a', 'se', 'a', ' ', 'la', ' ', 'sa', 'la']
      }
    ]
  },
  {
    id: 'level-6',
    title: 'Nivel 6: Frases (P)',
    description: 'Oraciones con Papá y Mamá.',
    color: 'bg-kid-pink',
    items: [
      { 
        id: 'l6-1', 
        type: 'sentence', 
        text: 'papá ama a mamá', 
        words: ['papá', 'ama', 'a', 'mamá'],
        syllables: ['pa', 'pá', ' ', 'a', 'ma', ' ', 'a', ' ', 'ma', 'má'],
        image: `${IMG_BASE}/parents/400/250`
      },
      { 
        id: 'l6-2', 
        type: 'sentence', 
        text: 'mamá ama a papi', 
        words: ['mamá', 'ama', 'a', 'papi'],
        syllables: ['ma', 'má', ' ', 'a', 'ma', ' ', 'a', ' ', 'pa', 'pi']
      },
      { 
        id: 'l6-3', 
        type: 'sentence', 
        text: 'mi papá me ama', 
        words: ['mi', 'papá', 'me', 'ama'],
        syllables: ['mi', ' ', 'pa', 'pá', ' ', 'me', ' ', 'a', 'ma']
      },
      { 
        id: 'l6-4', 
        type: 'sentence', 
        text: 'amo a mi papá', 
        words: ['amo', 'a', 'mi', 'papá'],
        syllables: ['a', 'mo', ' ', 'a', ' ', 'mi', ' ', 'pa', 'pá']
      }
    ]
  },
  {
    id: 'level-7',
    title: 'Nivel 7: Repaso (L)',
    description: 'Más práctica: loma, palo, ala...',
    color: 'bg-kid-yellow',
    items: [
      { id: 'l7-1', type: 'word', text: 'loma', syllables: ['lo', 'ma'], image: `${IMG_BASE}/hill/300/300` },
      { id: 'l7-2', type: 'word', text: 'palo', syllables: ['pa', 'lo'], image: `${IMG_BASE}/stick/300/300` },
      { id: 'l7-3', type: 'word', text: 'ala', syllables: ['a', 'la'], image: `${IMG_BASE}/wing/300/300` },
      { id: 'l7-4', type: 'word', text: 'pala', syllables: ['pa', 'la'], image: `${IMG_BASE}/shovel/300/300` },
      { id: 'l7-5', type: 'word', text: 'lima', syllables: ['li', 'ma'], image: `${IMG_BASE}/lime/300/300` },
      { id: 'l7-6', type: 'word', text: 'pila', syllables: ['pi', 'la'], image: `${IMG_BASE}/battery/300/300` },
      { id: 'l7-7', type: 'word', text: 'lee', syllables: ['le', 'e'], image: `${IMG_BASE}/reading/300/300` },
      { id: 'l7-8', type: 'word', text: 'paloma', syllables: ['pa', 'lo', 'ma'], image: `${IMG_BASE}/pigeon/300/300` },
      { id: 'l7-9', type: 'word', text: 'lomo', syllables: ['lo', 'mo'], image: `${IMG_BASE}/meat/300/300` },
      { id: 'l7-10', type: 'word', text: 'lupa', syllables: ['lu', 'pa'], image: `${IMG_BASE}/magnifying/300/300` },
      { id: 'l7-11', type: 'word', text: 'mula', syllables: ['mu', 'la'], image: `${IMG_BASE}/mule/300/300` },
      { id: 'l7-12', type: 'word', text: 'lame', syllables: ['la', 'me'], image: `${IMG_BASE}/dog/300/300` },
    ]
  }
];