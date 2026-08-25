export type DialogueLine = {
  speaker: "A" | "B";
  name: string;
  en: string;
  es: string;
};

export type ListeningChunk = {
  written: string;
  heard: string;
  meaning: string;
};

export type Mission = {
  id: number;
  week: number;
  day: number;
  title: string;
  context: string;
  objective: string;
  dialogue: DialogueLine[];
  question: string;
  options: string[];
  answer: number;
  chunks: ListeningChunk[];
  responsePrompt: string;
  modelResponse: string;
  modelResponseEs: string;
  languageFocus?: string;
};

export type TrainingWeek = {
  number: number;
  title: string;
  objective: string;
  missions: Mission[];
};

type RawMission = Omit<Mission, "id" | "week" | "day">;

const line = (speaker: "A" | "B", name: string, en: string, es: string): DialogueLine => ({ speaker, name, en, es });
const chunk = (written: string, heard: string, meaning: string): ListeningChunk => ({ written, heard, meaning });

const RAW_WEEKS: Array<Omit<TrainingWeek, "number" | "missions"> & { missions: RawMission[] }> = [
  {
    title: "Oído de supervivencia",
    objective: "Separar bloques de sentido y reparar una conversación sin entrar en pánico.",
    missions: [
      {
        title: "Llegar y reaccionar",
        context: "Tu compañero te encuentra al comenzar el turno.",
        objective: "Captar intención, tiempo y responder con naturalidad.",
        dialogue: [
          line("A", "Lisa", "Morning, Marco. You all set?", "Buenos días, Marco. ¿Todo listo?"),
          line("B", "Marco", "Almost. Let me grab my coffee.", "Casi. Déjame tomar mi café."),
          line("A", "Lisa", "No rush. We start in ten.", "No hay prisa. Empezamos en diez minutos."),
          line("B", "Marco", "Got it. I'll be there.", "Entendido. Ahí estaré."),
        ],
        question: "¿Cuándo comienzan?",
        options: ["Ahora mismo", "En diez minutos", "Después del café"],
        answer: 1,
        chunks: [chunk("You all set?", "y'all SET?", "¿Todo listo?"), chunk("Let me", "LEM-me", "Déjame"), chunk("Got it", "GAH-dit", "Entendido")],
        responsePrompt: "Lisa te pregunta: “You all set?” Responde que casi estás listo.",
        modelResponse: "Almost. Give me one minute.",
        modelResponseEs: "Casi. Dame un minuto.",
      },
      {
        title: "Recuperar un número",
        context: "Tu supervisor cambia una orden y no escuchaste el número.",
        objective: "Interrumpir con seguridad y confirmar el dato crítico.",
        dialogue: [
          line("A", "David", "Marco, move order two eighteen after lunch.", "Marco, mueve la orden 218 después de comer."),
          line("B", "Marco", "Sorry, I caught “order,” but not the number.", "Disculpa, entendí “orden”, pero no el número."),
          line("A", "David", "Two one eight. After lunch.", "Dos uno ocho. Después de comer."),
          line("B", "Marco", "Order two eighteen after lunch, right?", "Orden 218 después de comer, ¿correcto?"),
        ],
        question: "¿Qué orden debe moverse?",
        options: ["Orden 280", "Orden 218", "Orden 208"],
        answer: 1,
        chunks: [chunk("I caught", "eye CAWT", "Sí alcancé a entender"), chunk("but not the", "buh-naht-thuh", "pero no el/la"), chunk("right?", "RIGHT?", "¿correcto?")],
        responsePrompt: "No entendiste la hora. Pide que repitan únicamente la hora.",
        modelResponse: "Sorry, could you repeat the time?",
        modelResponseEs: "Disculpa, ¿podrías repetir la hora?",
      },
      {
        title: "Ubicar una junta",
        context: "Buscas la sala correcta antes de una reunión.",
        objective: "Entender indicaciones cortas y verificar el lugar.",
        dialogue: [
          line("A", "Marco", "Excuse me, where's the planning meeting?", "Disculpa, ¿dónde es la junta de planeación?"),
          line("B", "Ana", "Conference room B, across from quality.", "Sala de juntas B, frente a calidad."),
          line("A", "Marco", "Across from quality, on the first floor?", "Frente a calidad, ¿en el primer piso?"),
          line("B", "Ana", "That's right. It starts at nine.", "Así es. Empieza a las nueve."),
        ],
        question: "¿Dónde es la junta?",
        options: ["Sala B frente a calidad", "Sala A junto a compras", "Segundo piso"],
        answer: 0,
        chunks: [chunk("Where's the", "WHERE-zthuh", "¿Dónde está el/la...?"), chunk("across from", "uh-CROSS-frum", "frente a"), chunk("That's right", "that's RIGHT", "Así es")],
        responsePrompt: "Confirma que la sala está frente a calidad.",
        modelResponse: "Conference room B, across from quality. Got it.",
        modelResponseEs: "Sala B, frente a calidad. Entendido.",
      },
      {
        title: "Aceptar o rechazar un plan",
        context: "Un compañero propone comer juntos.",
        objective: "Responder sin traducir una invitación común.",
        dialogue: [
          line("A", "Sam", "Are you free for lunch today?", "¿Estás libre para comer hoy?"),
          line("B", "Marco", "I think so. What time are you going?", "Creo que sí. ¿A qué hora vas?"),
          line("A", "Sam", "Around one. We're getting tacos nearby.", "Como a la una. Vamos por tacos cerca."),
          line("B", "Marco", "Sounds good. I'll meet you downstairs.", "Suena bien. Te veo abajo."),
        ],
        question: "¿Qué decidieron?",
        options: ["Comer tacos cerca a la una", "Cancelar la comida", "Comer a las dos"],
        answer: 0,
        chunks: [chunk("Are you free", "arya FREE", "¿Estás libre...?"), chunk("around one", "uh-ROUND-wun", "como a la una"), chunk("Sounds good", "sounds GOOD", "Me parece bien")],
        responsePrompt: "Acepta la invitación y pregunta dónde se verán.",
        modelResponse: "Sounds good. Where should we meet?",
        modelResponseEs: "Me parece bien. ¿Dónde nos vemos?",
      },
      {
        title: "Entender una actualización",
        context: "Te avisan de un pequeño retraso antes de iniciar.",
        objective: "Extraer causa, impacto y nueva hora.",
        dialogue: [
          line("A", "Lisa", "Quick update: the truck's running late.", "Actualización rápida: el camión viene retrasado."),
          line("B", "Marco", "How late are we talking?", "¿De cuánto retraso hablamos?"),
          line("A", "Lisa", "About thirty minutes. It should be here by ten.", "Unos treinta minutos. Debe estar aquí a más tardar a las diez."),
          line("B", "Marco", "Okay, I'll let the warehouse know.", "De acuerdo, avisaré al almacén."),
        ],
        question: "¿A qué hora debe llegar el camión?",
        options: ["9:30", "10:00", "10:30"],
        answer: 1,
        chunks: [chunk("truck's running late", "trucks RUN-ning late", "el camión viene tarde"), chunk("How late", "how LATE", "¿Cuánto retraso?"), chunk("should be here by", "shud-be-HERE-by", "debe llegar a más tardar")],
        responsePrompt: "Di que avisarás al equipo de almacén.",
        modelResponse: "Understood. I'll notify the warehouse team.",
        modelResponseEs: "Entendido. Avisaré al equipo de almacén.",
      },
      {
        title: "Misión: reparar sin bloquearte",
        context: "Recibes dos datos seguidos en una conversación natural.",
        objective: "Usar una estrategia de rescate y confirmar sólo lo esencial.",
        dialogue: [
          line("A", "David", "The supplier called. The parts will be here Thursday afternoon.", "Llamó el proveedor. Las piezas estarán aquí el jueves por la tarde."),
          line("B", "Marco", "I missed the day. Did you say Tuesday?", "No entendí el día. ¿Dijiste martes?"),
          line("A", "David", "Thursday, not Tuesday. Sometime after two.", "Jueves, no martes. En algún momento después de las dos."),
          line("B", "Marco", "Thursday after two. Thanks for clarifying.", "Jueves después de las dos. Gracias por aclararlo."),
        ],
        question: "¿Cuándo llegarán las piezas?",
        options: ["Martes antes de las dos", "Jueves después de las dos", "Jueves por la mañana"],
        answer: 1,
        chunks: [chunk("I missed the", "eye MISSED-thuh", "No entendí el/la"), chunk("Did you say", "DID-ja say", "¿Dijiste...?"), chunk("Thanks for clarifying", "thanks-fer CLAR-ifying", "Gracias por aclararlo")],
        responsePrompt: "Confirma día y hora en una sola frase.",
        modelResponse: "The parts arrive Thursday after two, correct?",
        modelResponseEs: "Las piezas llegan el jueves después de las dos, ¿correcto?",
      },
    ],
  },
  {
    title: "Datos bajo presión",
    objective: "Distinguir cantidades, horas, fechas y códigos que no pueden adivinarse.",
    missions: [
      {
        title: "Fifteen o fifty",
        context: "Producción reporta una cantidad que suena parecida.",
        objective: "Usar acento y contexto para separar 15 de 50.",
        dialogue: [line("A", "Ana", "How many pieces are finished?", "¿Cuántas piezas están terminadas?"), line("B", "Luis", "Fifty. We finished fifty, not fifteen.", "Cincuenta. Terminamos cincuenta, no quince."), line("A", "Ana", "Okay, fifty completed. How many are left?", "Bien, cincuenta terminadas. ¿Cuántas faltan?"), line("B", "Luis", "Twenty-five more.", "Veinticinco más.")],
        question: "¿Cuántas piezas están terminadas?",
        options: ["15", "25", "50"], answer: 2,
        chunks: [chunk("fifTEEN", "fif-TEEN", "15: fuerza al final"), chunk("FIFty", "FIF-dee", "50: fuerza al inicio"), chunk("How many are left?", "how-many-r-LEFT", "¿Cuántas faltan?")],
        responsePrompt: "Confirma que terminaron cincuenta y faltan veinticinco.", modelResponse: "Fifty are finished, and twenty-five are left.", modelResponseEs: "Cincuenta están terminadas y faltan veinticinco."
      },
      {
        title: "Puerta y hora",
        context: "Un chofer confirma su llegada.",
        objective: "Retener dos datos diferentes dentro del mismo mensaje.",
        dialogue: [line("A", "Driver", "I'll be at gate two around three forty-five.", "Estaré en la puerta dos como a las 3:45."), line("B", "Marco", "Gate two at three fifteen?", "¿Puerta dos a las 3:15?"), line("A", "Driver", "Three forty-five. I may be five minutes early.", "3:45. Puede que llegue cinco minutos antes."), line("B", "Marco", "Got it. I'll notify security.", "Entendido. Avisaré a seguridad.")],
        question: "¿Cuál es la información correcta?", options: ["Puerta 2, 3:45", "Puerta 3, 2:45", "Puerta 2, 3:15"], answer: 0,
        chunks: [chunk("I'll be at", "ahl-bee-at", "Estaré en"), chunk("three forty-five", "three FOR-dee-five", "3:45"), chunk("may be", "MAY-bee", "puede que")],
        responsePrompt: "Confirma puerta y hora al chofer.", modelResponse: "Gate two at three forty-five. We'll be ready.", modelResponseEs: "Puerta dos a las 3:45. Estaremos listos."
      },
      {
        title: "Fecha límite real",
        context: "Compras necesita un documento antes de una fecha.",
        objective: "Diferenciar la fecha del evento y la fecha límite.",
        dialogue: [line("A", "Buyer", "The audit is Friday, August twenty-eighth.", "La auditoría es el viernes 28 de agosto."), line("B", "Marco", "When do you need my documents?", "¿Cuándo necesitas mis documentos?"), line("A", "Buyer", "By Wednesday afternoon, so we can review them Thursday.", "A más tardar el miércoles por la tarde, para revisarlos el jueves."), line("B", "Marco", "I'll send everything Wednesday morning.", "Enviaré todo el miércoles por la mañana.")],
        question: "¿Cuándo enviará Marco los documentos?", options: ["Miércoles por la mañana", "Jueves por la tarde", "Viernes 28"], answer: 0,
        chunks: [chunk("When do you need", "when-dya-NEED", "¿Cuándo necesitas...?"), chunk("by Wednesday", "by WENZ-day", "a más tardar el miércoles"), chunk("so we can", "so-we-kin", "para que podamos")],
        responsePrompt: "Di que los enviarás el miércoles por la mañana.", modelResponse: "I'll send the documents Wednesday morning.", modelResponseEs: "Enviaré los documentos el miércoles por la mañana."
      },
      {
        title: "Teléfono por bloques",
        context: "Tomas un número durante una llamada.",
        objective: "Agrupar dígitos y solicitar una repetición parcial.",
        dialogue: [line("A", "Caller", "You can reach me at six one nine, five five five, zero two eight four.", "Puedes localizarme al 619-555-0284."), line("B", "Marco", "I have six one nine, five five five. Could you repeat the last four?", "Tengo 619-555. ¿Puedes repetir los últimos cuatro?"), line("A", "Caller", "Zero two eight four.", "Cero dos ocho cuatro."), line("B", "Marco", "Perfect, thank you.", "Perfecto, gracias.")],
        question: "¿Cuáles son los últimos cuatro dígitos?", options: ["0248", "0284", "0824"], answer: 1,
        chunks: [chunk("reach me at", "reach-me-at", "localizarme al"), chunk("last four", "last FOUR", "últimos cuatro"), chunk("zero", "ZEE-roh / oh", "cero")],
        responsePrompt: "Pide que repitan los últimos tres dígitos.", modelResponse: "Could you repeat the last three digits?", modelResponseEs: "¿Podrías repetir los últimos tres dígitos?"
      },
      {
        title: "Precio por unidad",
        context: "Revisas una cotización con compras.",
        objective: "Captar precio, moneda y condición.",
        dialogue: [line("A", "Supplier", "The new price is twelve eighty per unit.", "El nuevo precio es 12.80 por unidad."), line("B", "Marco", "Does that include shipping?", "¿Eso incluye envío?"), line("A", "Supplier", "No, shipping is another forty dollars.", "No, el envío cuesta cuarenta dólares adicionales."), line("B", "Marco", "Please send the total in writing.", "Envía el total por escrito, por favor.")],
        question: "¿Qué no está incluido en los 12.80?", options: ["Impuestos", "Embalaje", "Envío"], answer: 2,
        chunks: [chunk("twelve eighty", "twelv-EIGH-dee", "$12.80"), chunk("Does that include", "duz-that-in-CLOOD", "¿Eso incluye...?"), chunk("another forty", "uh-nuther FOR-dee", "cuarenta adicionales")],
        responsePrompt: "Pide el total por escrito.", modelResponse: "Could you send me the total in writing?", modelResponseEs: "¿Podrías enviarme el total por escrito?"
      },
      {
        title: "Misión: tres datos críticos",
        context: "Recibes orden, cantidad y límite en una sola llamada.",
        objective: "Tomar notas por categorías sin traducir cada palabra.",
        dialogue: [line("A", "Customer", "We need one hundred twenty units for order nine forty by ten fifteen Monday.", "Necesitamos 120 unidades para la orden 940 a más tardar el lunes a las 10:15."), line("B", "Marco", "Let me confirm: order nine forty, one twenty units, Monday at ten fifteen.", "Déjame confirmar: orden 940, 120 unidades, lunes a las 10:15."), line("A", "Customer", "Correct. Please call if the schedule changes.", "Correcto. Llama si cambia el programa."), line("B", "Marco", "I will. Thanks.", "Lo haré. Gracias.")],
        question: "¿Cuál combinación es correcta?", options: ["Orden 914 · 120 · martes 10:15", "Orden 940 · 120 · lunes 10:15", "Orden 940 · 112 · lunes 10:50"], answer: 1,
        chunks: [chunk("one hundred twenty", "one-HUN-dred-TWEN-dee", "120"), chunk("by ten fifteen", "by-ten-fif-TEEN", "a más tardar 10:15"), chunk("Let me confirm", "LEM-me-confirm", "Déjame confirmar")],
        responsePrompt: "Repite orden, cantidad y fecha límite.", modelResponse: "Order nine forty, one hundred twenty units, by ten fifteen Monday.", modelResponseEs: "Orden 940, 120 unidades, a más tardar el lunes a las 10:15."
      },
    ],
  },
  {
    title: "Producción en contexto",
    objective: "Comprender instrucciones y reportes reales mediante causa, acción y resultado.",
    missions: [
      {
        title: "Prioridad del turno", context: "El supervisor reordena el programa.", objective: "Identificar acción, objeto y momento.",
        dialogue: [line("A", "David", "Before you start, move order four twenty-seven to the top.", "Antes de empezar, mueve la orden 427 al inicio."), line("B", "Marco", "Ahead of the Delta order?", "¿Antes de la orden Delta?"), line("A", "David", "Yes. Delta can wait until the second shift.", "Sí. Delta puede esperar al segundo turno."), line("B", "Marco", "Understood. Four twenty-seven goes first.", "Entendido. La 427 va primero.")],
        question: "¿Qué orden va primero?", options: ["Delta", "427", "Segundo turno"], answer: 1,
        chunks: [chunk("Before you start", "before-ya-START", "Antes de empezar"), chunk("to the top", "tuh-thuh-TOP", "al inicio"), chunk("goes first", "goes-FIRST", "va primero")],
        responsePrompt: "Confirma que la 427 será la primera.", modelResponse: "Understood. Order four twenty-seven will run first.", modelResponseEs: "Entendido. La orden 427 correrá primero."
      },
      {
        title: "Material insuficiente", context: "Una orden no puede iniciar completa.", objective: "Distinguir problema, cantidad disponible y siguiente acción.",
        dialogue: [line("A", "Luis", "We're short on foam for the full order.", "Nos falta espuma para la orden completa."), line("B", "Marco", "How much can we run?", "¿Cuánto podemos producir?"), line("A", "Luis", "About sixty percent. Purchasing is checking the balance.", "Aproximadamente 60%. Compras está revisando el resto."), line("B", "Marco", "Run what we have, but hold the shipment.", "Produce lo que tenemos, pero detén el embarque.")],
        question: "¿Qué porcentaje pueden producir?", options: ["40%", "60%", "Todo"], answer: 1,
        chunks: [chunk("We're short on", "weer-SHORT-on", "Nos falta"), chunk("How much can we run?", "how-much-kin-we-RUN", "¿Cuánto podemos producir?"), chunk("hold the shipment", "hold-thuh-SHIP-ment", "detén el embarque")],
        responsePrompt: "Pide producir lo disponible sin embarcar todavía.", modelResponse: "Run the available material, but don't ship yet.", modelResponseEs: "Produce el material disponible, pero no embarques todavía."
      },
      {
        title: "Máquina detenida", context: "Mantenimiento atiende una falla.", objective: "Captar duración estimada y consecuencia.",
        dialogue: [line("A", "Luis", "Machine four went down about twenty minutes ago.", "La máquina cuatro se detuvo hace unos veinte minutos."), line("B", "Marco", "Do we have an estimate from maintenance?", "¿Tenemos una estimación de mantenimiento?"), line("A", "Luis", "They need another hour, maybe longer.", "Necesitan otra hora, quizá más."), line("B", "Marco", "Then I'll move the next order to machine two.", "Entonces moveré la siguiente orden a la máquina dos.")],
        question: "¿Qué hará Marco?", options: ["Esperar sin cambiar nada", "Mover la siguiente orden a máquina 2", "Detener máquina 2"], answer: 1,
        chunks: [chunk("went down", "went-DOWN", "se detuvo"), chunk("Do we have an estimate", "dwe-have-an-ES-ti-mate", "¿Tenemos una estimación?"), chunk("maybe longer", "may-bee-LONG-er", "quizá más")],
        responsePrompt: "Di que moverás la siguiente orden a máquina dos.", modelResponse: "I'll move the next order to machine two.", modelResponseEs: "Moveré la siguiente orden a la máquina dos."
      },
      {
        title: "Calidad encontró un defecto", context: "Las primeras piezas fallaron inspección.", objective: "Entender alcance, decisión y condición para reiniciar.",
        dialogue: [line("A", "Quality", "We found a surface defect on the first three pieces.", "Encontramos un defecto superficial en las primeras tres piezas."), line("B", "Marco", "Should we stop the run?", "¿Debemos detener la corrida?"), line("A", "Quality", "Yes. Hold production until we approve a new sample.", "Sí. Detén producción hasta que aprobemos una muestra nueva."), line("B", "Marco", "I'll update the schedule and notify the supervisor.", "Actualizaré el programa y avisaré al supervisor.")],
        question: "¿Cuándo pueden reiniciar?", options: ["Después de tres piezas", "Cuando aprueben una muestra nueva", "Al terminar el turno"], answer: 1,
        chunks: [chunk("found a", "FOUND-uh", "encontramos un"), chunk("Should we", "SHUD-we", "¿Debemos...?"), chunk("until we approve", "until-we-uh-PROOV", "hasta que aprobemos")],
        responsePrompt: "Confirma que detendrás producción y avisarás.", modelResponse: "We'll stop the run. I'll notify the supervisor.", modelResponseEs: "Detendremos la corrida. Avisaré al supervisor."
      },
      {
        title: "Recuperar el programa", context: "Buscan compensar dos horas de atraso.", objective: "Seguir una propuesta y detectar su riesgo.",
        dialogue: [line("A", "David", "We're two hours behind. Can second shift stay late?", "Llevamos dos horas de atraso. ¿Puede quedarse tarde el segundo turno?"), line("B", "Marco", "They can stay one hour, but material is limited.", "Pueden quedarse una hora, pero el material es limitado."), line("A", "David", "Then protect the urgent order and move the rest.", "Entonces protege la orden urgente y mueve el resto."), line("B", "Marco", "I'll revise the plan and send it out.", "Revisaré el plan y lo enviaré.")],
        question: "¿Cuál es la prioridad?", options: ["Todas las órdenes", "La orden urgente", "La hora extra"], answer: 1,
        chunks: [chunk("two hours behind", "two-hours-be-HIND", "dos horas atrasados"), chunk("stay late", "stay-LATE", "quedarse tarde"), chunk("send it out", "sen-dit-OUT", "enviarlo/distribuirlo")],
        responsePrompt: "Di que revisarás y enviarás el plan.", modelResponse: "I'll revise the schedule and send the update.", modelResponseEs: "Revisaré el programa y enviaré la actualización."
      },
      {
        title: "Misión: reporte de 30 segundos", context: "El gerente pide estado inmediato.", objective: "Organizar un reporte en situación, impacto y acción.",
        dialogue: [line("A", "Manager", "Marco, what's the current status?", "Marco, ¿cuál es el estado actual?"), line("B", "Marco", "Machine four is down, so order eight twelve is about an hour late.", "La máquina cuatro está detenida, así que la orden 812 lleva aproximadamente una hora de atraso."), line("A", "Manager", "What's the recovery plan?", "¿Cuál es el plan de recuperación?"), line("B", "Marco", "Maintenance is working on it, and I moved the next order to machine two.", "Mantenimiento está trabajando y moví la siguiente orden a la máquina dos.")],
        question: "¿Qué orden está retrasada?", options: ["218", "427", "812"], answer: 2,
        chunks: [chunk("what's the current status", "whats-thuh-current-STATUS", "¿Cuál es el estado actual?"), chunk("about an hour late", "about-an-hour-LATE", "aprox. una hora tarde"), chunk("working on it", "working-on-it", "atendiéndolo")],
        responsePrompt: "Resume problema y acción en dos oraciones.", modelResponse: "Machine four is down. I moved the next order to machine two.", modelResponseEs: "La máquina cuatro está detenida. Moví la siguiente orden a la máquina dos."
      },
    ],
  },
  {
    title: "Teléfono y proveedores",
    objective: "Mantener llamadas breves, tomar mensajes y proteger compromisos.",
    missions: [
      {
        title: "Abrir una llamada", context: "Contestas una llamada externa.", objective: "Reconocer identidad, empresa y motivo.",
        dialogue: [line("A", "Marco", "Good afternoon, production planning. This is Marco.", "Buenas tardes, planeación de producción. Habla Marco."), line("B", "Caller", "Hi, Marco. This is Rachel from Delta Supply.", "Hola, Marco. Soy Rachel de Delta Supply."), line("A", "Marco", "Hi, Rachel. How can I help you?", "Hola, Rachel. ¿Cómo puedo ayudarte?"), line("B", "Rachel", "I'm calling about purchase order seven sixty-two.", "Llamo por la orden de compra 762.")],
        question: "¿Por qué llama Rachel?", options: ["Por la orden 762", "Por una entrevista", "Por calidad"], answer: 0,
        chunks: [chunk("This is", "THIS-is", "Habla/Soy"), chunk("How can I help you?", "how-kin-I-HELP-ya", "¿Cómo puedo ayudarte?"), chunk("calling about", "calling-uh-BOUT", "llamando por")],
        responsePrompt: "Preséntate y pregunta cómo puedes ayudar.", modelResponse: "This is Marco from planning. How can I help you?", modelResponseEs: "Habla Marco de planeación. ¿Cómo puedo ayudarte?"
      },
      {
        title: "Tomar un mensaje", context: "Buscan a alguien que está en junta.", objective: "Recoger persona, acción y límite.",
        dialogue: [line("A", "Caller", "Could I speak with Ana in purchasing?", "¿Podría hablar con Ana de compras?"), line("B", "Marco", "She's in a meeting. Can I take a message?", "Está en una junta. ¿Puedo tomar un mensaje?"), line("A", "Caller", "Please ask her to call me before four.", "Pídele que me llame antes de las cuatro."), line("B", "Marco", "Of course. May I have your name?", "Claro. ¿Me da su nombre?")],
        question: "¿Qué debe hacer Ana?", options: ["Enviar un correo mañana", "Llamar antes de las cuatro", "Entrar a la junta"], answer: 1,
        chunks: [chunk("Could I speak with", "could-I-SPEAK-with", "¿Podría hablar con...?"), chunk("take a message", "take-uh-MESS-ij", "tomar un mensaje"), chunk("ask her to", "ASK-er-tuh", "pedirle que")],
        responsePrompt: "Pide nombre y empresa.", modelResponse: "May I have your name and company, please?", modelResponseEs: "¿Me da su nombre y empresa, por favor?"
      },
      {
        title: "Deletrear sin perderte", context: "Confirmas un apellido por teléfono.", objective: "Usar el alfabeto fonético y verificar por partes.",
        dialogue: [line("A", "Caller", "My last name is Varela.", "Mi apellido es Varela."), line("B", "Marco", "Could you spell that, please?", "¿Podría deletrearlo, por favor?"), line("A", "Caller", "V as in Victor, A as in Alpha, R-E-L-A.", "V de Victor, A de Alpha, R-E-L-A."), line("B", "Marco", "V-A-R-E-L-A. Is that correct?", "V-A-R-E-L-A. ¿Es correcto?")],
        question: "¿Cuál es el apellido?", options: ["Valera", "Varela", "Barelas"], answer: 1,
        chunks: [chunk("spell that", "SPELL-that", "deletrear eso"), chunk("as in", "az-in", "como en"), chunk("Is that correct?", "iz-that-correct", "¿Es correcto?")],
        responsePrompt: "Pide que deletreen el nombre más despacio.", modelResponse: "Could you spell the name more slowly?", modelResponseEs: "¿Podría deletrear el nombre más despacio?"
      },
      {
        title: "Cotización completa", context: "Solicitas precio y condiciones.", objective: "Hacer una petición con cantidad y requisitos.",
        dialogue: [line("A", "Marco", "Could you quote five hundred sheets of material A-four?", "¿Podría cotizar 500 hojas de material A4?"), line("B", "Supplier", "Sure. Do you need standard or expedited shipping?", "Claro. ¿Necesita envío estándar o urgente?"), line("A", "Marco", "Please show both options and the current lead time.", "Muestre ambas opciones y el tiempo de entrega actual."), line("B", "Supplier", "I'll send the quote this afternoon.", "Enviaré la cotización esta tarde.")],
        question: "¿Qué debe mostrar la cotización?", options: ["Sólo precio unitario", "Dos opciones de envío y tiempo de entrega", "Únicamente envío urgente"], answer: 1,
        chunks: [chunk("Could you quote", "could-ja-QUOTE", "¿Podría cotizar...?"), chunk("Do you need", "dya-NEED", "¿Necesita...?"), chunk("lead time", "LEED-time", "tiempo de entrega")],
        responsePrompt: "Pide ambas opciones y el tiempo de entrega.", modelResponse: "Please include both shipping options and the lead time.", modelResponseEs: "Incluya ambas opciones de envío y el tiempo de entrega."
      },
      {
        title: "Promesa de entrega", context: "La fecha solicitada está en riesgo.", objective: "Diferenciar posibilidad de garantía.",
        dialogue: [line("A", "Marco", "Can you deliver by Friday?", "¿Puede entregar para el viernes?"), line("B", "Supplier", "We can ship Thursday, but I can't guarantee Friday delivery.", "Podemos embarcar el jueves, pero no puedo garantizar entrega el viernes."), line("A", "Marco", "What's the earliest guaranteed date?", "¿Cuál es la fecha garantizada más próxima?"), line("B", "Supplier", "Monday before noon.", "El lunes antes del mediodía.")],
        question: "¿Cuál es la fecha garantizada?", options: ["Jueves", "Viernes", "Lunes antes del mediodía"], answer: 2,
        chunks: [chunk("Can you", "kin-ya", "¿Puede...?"), chunk("can't guarantee", "CANT-guaran-TEE", "no puedo garantizar"), chunk("earliest guaranteed", "EAR-lee-est-guaran-TEED", "garantizada más próxima")],
        responsePrompt: "Confirma la fecha garantizada.", modelResponse: "Monday before noon is guaranteed, correct?", modelResponseEs: "El lunes antes del mediodía está garantizado, ¿correcto?"
      },
      {
        title: "Misión: seguimiento firme", context: "No recibiste una confirmación prometida.", objective: "Dar seguimiento con cortesía y límite claro.",
        dialogue: [line("A", "Marco", "I'm following up on the delivery confirmation.", "Doy seguimiento a la confirmación de entrega."), line("B", "Supplier", "We're still waiting for the carrier.", "Seguimos esperando al transportista."), line("A", "Marco", "I understand, but we need an answer before noon.", "Entiendo, pero necesitamos una respuesta antes del mediodía."), line("B", "Supplier", "I'll call them now and get back to you within an hour.", "Les llamaré ahora y te responderé dentro de una hora.")],
        question: "¿Cuándo responderá el proveedor?", options: ["Dentro de una hora", "Antes de terminar la semana", "Mañana"], answer: 0,
        chunks: [chunk("following up on", "following-up-on", "dando seguimiento a"), chunk("still waiting", "still-WAI-ding", "seguimos esperando"), chunk("get back to you", "get-BACK-tuh-ya", "responderte")],
        responsePrompt: "Pide una respuesta dentro de una hora.", modelResponse: "Please get back to me within one hour.", modelResponseEs: "Respóndeme dentro de una hora, por favor."
      },
    ],
  },
  {
    title: "Juntas y decisiones",
    objective: "Participar con claridad: aclarar, discrepar, asignar y cerrar acciones.",
    missions: [
      {
        title: "Abrir con prioridad", context: "Inicias una junta de diez minutos.", objective: "Marcar propósito y primer tema.",
        dialogue: [line("A", "Marco", "Let's keep this brief. We need to review today's priorities.", "Seamos breves. Necesitamos revisar las prioridades de hoy."), line("B", "Lisa", "Can we start with the delayed shipment?", "¿Podemos comenzar con el embarque retrasado?"), line("A", "Marco", "Yes. Then we'll cover production capacity.", "Sí. Después veremos capacidad de producción."), line("B", "Lisa", "Sounds good.", "Me parece bien.")],
        question: "¿Cuál será el primer tema?", options: ["Capacidad", "Embarque retrasado", "Presupuesto"], answer: 1,
        chunks: [chunk("Let's keep this brief", "lets-KEEP-this-brief", "Seamos breves"), chunk("Can we start with", "kin-we-START-with", "¿Podemos empezar con...?"), chunk("Then we'll", "then-will", "Después...")],
        responsePrompt: "Propón empezar con las órdenes urgentes.", modelResponse: "Let's start with the urgent orders.", modelResponseEs: "Empecemos con las órdenes urgentes."
      },
      {
        title: "Acordar con fundamento", context: "Evalúan mover una orden.", objective: "Expresar acuerdo y razón, no sólo decir yes.",
        dialogue: [line("A", "David", "I think we should move order three ten to tomorrow.", "Creo que debemos mover la orden 310 a mañana."), line("B", "Marco", "I agree. That gives us time to finish the urgent order.", "Estoy de acuerdo. Eso nos da tiempo para terminar la orden urgente."), line("A", "David", "Any risk to the customer?", "¿Algún riesgo para el cliente?"), line("B", "Marco", "Not if shipping confirms the new pickup time.", "No, si embarques confirma la nueva hora de recolección.")],
        question: "¿Por qué está de acuerdo Marco?", options: ["Reduce el precio", "Da tiempo para terminar la orden urgente", "Evita llamar al cliente"], answer: 1,
        chunks: [chunk("I think we should", "I-think-we-shud", "Creo que debemos"), chunk("That gives us", "that-GIV-zus", "Eso nos da"), chunk("Not if", "NOT-if", "No, si...")],
        responsePrompt: "Di que estás de acuerdo porque reduce el riesgo.", modelResponse: "I agree because it reduces the delivery risk.", modelResponseEs: "Estoy de acuerdo porque reduce el riesgo de entrega."
      },
      {
        title: "Discrepar sin fricción", context: "Una propuesta ignora el material disponible.", objective: "Señalar riesgo y proponer una verificación.",
        dialogue: [line("A", "Lisa", "Let's add the rush order to machine one.", "Agreguemos la orden urgente a la máquina uno."), line("B", "Marco", "I understand the idea, but I'm concerned about material.", "Entiendo la idea, pero me preocupa el material."), line("A", "Lisa", "Do you think we're short?", "¿Crees que nos falta?"), line("B", "Marco", "Possibly. Could we check inventory first?", "Posiblemente. ¿Podemos revisar inventario primero?")],
        question: "¿Qué propone Marco?", options: ["Cancelar la orden", "Revisar inventario primero", "Cambiar al segundo turno"], answer: 1,
        chunks: [chunk("I'm concerned about", "I'm-con-CERNED-about", "Me preocupa"), chunk("Do you think", "dya-THINK", "¿Crees...?"), chunk("Could we", "could-we", "¿Podríamos...?")],
        responsePrompt: "Expresa preocupación por la capacidad y pide revisarla.", modelResponse: "I'm concerned about capacity. Could we check it first?", modelResponseEs: "Me preocupa la capacidad. ¿Podemos revisarla primero?"
      },
      {
        title: "Aclarar el acuerdo", context: "No quedó claro cuál orden cambia.", objective: "Interrumpir para eliminar ambigüedad.",
        dialogue: [line("A", "David", "Okay, we'll move it to the second shift.", "Bien, la moveremos al segundo turno."), line("B", "Marco", "Just to clarify, which order are we moving?", "Sólo para aclarar, ¿qué orden moveremos?"), line("A", "David", "Order six fifteen, not six fifty.", "La orden 615, no la 650."), line("B", "Marco", "Six fifteen to second shift. Understood.", "615 al segundo turno. Entendido.")],
        question: "¿Cuál orden se mueve?", options: ["615", "650", "Segundo turno"], answer: 0,
        chunks: [chunk("Just to clarify", "just-tuh-CLAR-ify", "Sólo para aclarar"), chunk("which order are we", "which-order-r-we", "qué orden estamos"), chunk("not six fifty", "not-six-FIF-dee", "no 650")],
        responsePrompt: "Pregunta cuál orden se mueve al segundo turno.", modelResponse: "Just to clarify, which order moves to second shift?", modelResponseEs: "Sólo para aclarar, ¿qué orden se mueve al segundo turno?"
      },
      {
        title: "Asignar responsables", context: "Cierran acciones antes de salir.", objective: "Retener responsable, acción y plazo.",
        dialogue: [line("A", "Manager", "Marco will update the plan by noon.", "Marco actualizará el plan antes del mediodía."), line("B", "Marco", "I'll send it to production and purchasing.", "Lo enviaré a producción y compras."), line("A", "Manager", "Lisa, please contact the supplier before two.", "Lisa, contacta al proveedor antes de las dos."), line("B", "Lisa", "Got it. I'll share their answer with the group.", "Entendido. Compartiré su respuesta con el grupo.")],
        question: "¿Qué hará Lisa?", options: ["Actualizar el plan", "Contactar al proveedor antes de las dos", "Enviar a producción"], answer: 1,
        chunks: [chunk("by noon", "by-NOON", "a más tardar al mediodía"), chunk("please contact", "please-CON-tact", "contacta por favor"), chunk("share their answer", "share-their-ANSWER", "compartir su respuesta")],
        responsePrompt: "Confirma que actualizarás el plan antes del mediodía.", modelResponse: "I'll update and send the plan before noon.", modelResponseEs: "Actualizaré y enviaré el plan antes del mediodía."
      },
      {
        title: "Misión: cierre ejecutivo", context: "Resumes una decisión en veinte segundos.", objective: "Expresar decisión, responsables y plazos.",
        dialogue: [line("A", "Manager", "Before we finish, can you recap the decision?", "Antes de terminar, ¿puedes resumir la decisión?"), line("B", "Marco", "Order three ten moves to tomorrow. I'll revise the schedule by two.", "La orden 310 pasa a mañana. Revisaré el programa antes de las dos."), line("A", "Manager", "And the customer?", "¿Y el cliente?"), line("B", "Marco", "Lisa will call them as soon as we confirm shipping.", "Lisa les llamará en cuanto confirmemos el embarque.")],
        question: "¿Cuándo revisará Marco el programa?", options: ["Antes del mediodía", "Antes de las dos", "Mañana"], answer: 1,
        chunks: [chunk("Before we finish", "before-we-FIN-ish", "Antes de terminar"), chunk("recap the decision", "ree-CAP-thuh-decision", "resumir la decisión"), chunk("as soon as", "as-SOON-as", "en cuanto")],
        responsePrompt: "Resume la decisión y tu plazo.", modelResponse: "Order three ten moves to tomorrow. I'll update the schedule by two.", modelResponseEs: "La orden 310 pasa a mañana. Actualizaré el programa antes de las dos."
      },
    ],
  },
  {
    title: "Vida diaria sin guion",
    objective: "Resolver situaciones cotidianas fuera del trabajo con lenguaje funcional.",
    missions: [
      {
        title: "Pedir comida", context: "Ordenas en un restaurante y haces una modificación.", objective: "Escuchar preguntas previsibles y responder con restricciones.",
        dialogue: [line("A", "Server", "What can I get started for you?", "¿Qué puedo ir trayéndote?"), line("B", "Marco", "I'll have the grilled chicken, no cheese or cream, please.", "Quiero el pollo a la parrilla, sin queso ni crema, por favor."), line("A", "Server", "Would you like rice or vegetables with that?", "¿Quiere arroz o verduras con eso?"), line("B", "Marco", "Vegetables, please. And water is fine.", "Verduras, por favor. Y agua está bien.")],
        question: "¿Qué acompañamiento eligió Marco?", options: ["Arroz", "Verduras", "Ensalada con crema"], answer: 1,
        chunks: [chunk("What can I get started", "what-kin-I-get-STAR-ded", "¿Qué puedo ir trayendo?"), chunk("I'll have", "ahl-HAVE", "Quiero/Me da"), chunk("Would you like", "would-ja-LIKE", "¿Le gustaría...?")],
        responsePrompt: "Pide pollo sin queso ni crema.", modelResponse: "I'll have the chicken, with no cheese or cream, please.", modelResponseEs: "Quiero el pollo sin queso ni crema, por favor."
      },
      {
        title: "Pedir direcciones", context: "Buscas una farmacia cercana.", objective: "Seguir una secuencia corta con referencia visual.",
        dialogue: [line("A", "Marco", "Excuse me, is there a pharmacy nearby?", "Disculpa, ¿hay una farmacia cerca?"), line("B", "Local", "Yes. Go straight for two blocks, then turn left.", "Sí. Sigue derecho dos cuadras y luego gira a la izquierda."), line("A", "Marco", "Is it before or after the gas station?", "¿Está antes o después de la gasolinera?"), line("B", "Local", "Right after it, on your left.", "Justo después, a tu izquierda.")],
        question: "¿Dónde está la farmacia?", options: ["Antes de la gasolinera", "Después de la gasolinera, a la izquierda", "Dos cuadras a la derecha"], answer: 1,
        chunks: [chunk("Is there a", "iz-there-uh", "¿Hay un...?"), chunk("go straight", "go-STRAIGHT", "sigue derecho"), chunk("right after it", "right-AF-ter-it", "justo después")],
        responsePrompt: "Confirma: dos cuadras y luego a la izquierda.", modelResponse: "Two blocks straight, then left. Thank you.", modelResponseEs: "Dos cuadras derecho y luego a la izquierda. Gracias."
      },
      {
        title: "Cita médica", context: "Confirmas una cita por teléfono.", objective: "Manejar nombre, día, hora e instrucción.",
        dialogue: [line("A", "Reception", "I'm calling to confirm your appointment for Tuesday at eleven thirty.", "Llamo para confirmar su cita del martes a las 11:30."), line("B", "Marco", "Tuesday at eleven thirty. Do I need to arrive early?", "Martes a las 11:30. ¿Necesito llegar antes?"), line("A", "Reception", "Please arrive fifteen minutes early and bring your ID.", "Llegue quince minutos antes y traiga identificación."), line("B", "Marco", "Okay. I'll be there at eleven fifteen.", "Bien. Estaré ahí a las 11:15.")],
        question: "¿A qué hora debe llegar?", options: ["11:00", "11:15", "11:30"], answer: 1,
        chunks: [chunk("calling to confirm", "calling-tuh-confirm", "llamo para confirmar"), chunk("Do I need to", "dye-need-tuh", "¿Necesito...?"), chunk("fifteen minutes early", "fif-TEEN-minutes-EAR-ly", "15 minutos antes")],
        responsePrompt: "Confirma que llegarás a las 11:15.", modelResponse: "I'll arrive at eleven fifteen with my ID.", modelResponseEs: "Llegaré a las 11:15 con mi identificación."
      },
      {
        title: "Hotel y problema", context: "La habitación no está lista.", objective: "Explicar problema, entender opción y elegir solución.",
        dialogue: [line("A", "Clerk", "I'm sorry, your room won't be ready until four.", "Lo siento, su habitación no estará lista hasta las cuatro."), line("B", "Marco", "We were told check-in was at three.", "Nos dijeron que el registro era a las tres."), line("A", "Clerk", "That's correct. We can store your bags and text you when it's ready.", "Es correcto. Podemos guardar sus maletas y enviarle mensaje cuando esté lista."), line("B", "Marco", "Okay, please text me at this number.", "Bien, envíame mensaje a este número.")],
        question: "¿Qué solución ofrece el hotel?", options: ["Cambiar de hotel", "Guardar maletas y enviar mensaje", "Dar otra habitación ahora"], answer: 1,
        chunks: [chunk("won't be ready until", "wont-be-READY-until", "no estará listo hasta"), chunk("We were told", "we-were-TOLD", "Nos dijeron"), chunk("store your bags", "store-yer-BAGS", "guardar sus maletas")],
        responsePrompt: "Acepta y pide que te envíen mensaje.", modelResponse: "That's fine. Please text me when the room is ready.", modelResponseEs: "Está bien. Envíame mensaje cuando la habitación esté lista."
      },
      {
        title: "Conversación breve", context: "Alguien conversa contigo mientras esperas.", objective: "Responder y devolver una pregunta sencilla.",
        dialogue: [line("A", "Sam", "Long day, huh?", "Día largo, ¿verdad?"), line("B", "Marco", "Yeah, but it went pretty well.", "Sí, pero salió bastante bien."), line("A", "Sam", "Do you have any plans for the weekend?", "¿Tienes planes para el fin de semana?"), line("B", "Marco", "I'm going to rest and spend time with my family. How about you?", "Voy a descansar y pasar tiempo con mi familia. ¿Y tú?")],
        question: "¿Qué hará Marco el fin de semana?", options: ["Trabajar", "Viajar solo", "Descansar y estar con su familia"], answer: 2,
        chunks: [chunk("Long day, huh?", "long-DAY-huh", "Día largo, ¿verdad?"), chunk("went pretty well", "went-pretty-WELL", "salió bastante bien"), chunk("How about you?", "how-bout-YOU", "¿Y tú?")],
        responsePrompt: "Di tu plan y devuelve la pregunta.", modelResponse: "I'm going to rest at home. How about you?", modelResponseEs: "Voy a descansar en casa. ¿Y tú?"
      },
      {
        title: "Misión: resolver un cambio", context: "Un vuelo cambia de puerta.", objective: "Detectar anuncio, verificar y decidir.",
        dialogue: [line("A", "Announcement", "Flight two sixteen to Tijuana now departs from gate twenty-four.", "El vuelo 216 a Tijuana ahora sale de la puerta 24."), line("B", "Marco", "Excuse me, did they say gate fourteen or twenty-four?", "Disculpa, ¿dijeron puerta 14 o 24?"), line("A", "Traveler", "Twenty-four. Boarding starts in about ten minutes.", "24. El abordaje empieza en unos diez minutos."), line("B", "Marco", "Thanks. We'd better head over now.", "Gracias. Será mejor que vayamos ahora.")],
        question: "¿Cuál es la nueva puerta?", options: ["14", "16", "24"], answer: 2,
        chunks: [chunk("now departs from", "now-de-PARTS-frum", "ahora sale de"), chunk("did they say", "did-they-SAY", "¿dijeron...?"), chunk("We'd better", "weed-BET-ter", "Será mejor que")],
        responsePrompt: "Confirma puerta y tiempo para abordar.", modelResponse: "Gate twenty-four. Boarding starts in ten minutes.", modelResponseEs: "Puerta 24. El abordaje comienza en diez minutos."
      },
    ],
  },
  {
    title: "Inglés que suena pegado",
    objective: "Reconocer reducciones frecuentes dentro de diálogos, sin convertirlas en una lista para memorizar.",
    missions: [
      {
        title: "Did you → didja", context: "Compras pregunta por un archivo.", objective: "Reconocer una pregunta reducida y responder con tiempo.",
        dialogue: [line("A", "Ana", "Did you send the updated file?", "¿Enviaste el archivo actualizado?"), line("B", "Marco", "Yes, I sent it this morning.", "Sí, lo envié esta mañana."), line("A", "Ana", "Did you copy Lisa on the email?", "¿Copiaste a Lisa en el correo?"), line("B", "Marco", "I did. She already replied.", "Sí. Ella ya respondió.")],
        question: "¿Cuándo envió Marco el archivo?", options: ["Ayer", "Esta mañana", "Todavía no"], answer: 1,
        chunks: [chunk("Did you", "DID-ja", "¿Tú...?"), chunk("sent it", "SEN-dit", "lo envié"), chunk("already replied", "all-READY-replied", "ya respondió")],
        responsePrompt: "Di que lo enviaste esta mañana.", modelResponse: "Yes, I sent it this morning.", modelResponseEs: "Sí, lo envié esta mañana."
      },
      {
        title: "Going to → gonna", context: "Explican el siguiente paso.", objective: "Relacionar forma clara y forma conversacional.",
        dialogue: [line("A", "Lisa", "What are you gonna do about the late order?", "¿Qué vas a hacer con la orden retrasada?"), line("B", "Marco", "I'm gonna check capacity after lunch.", "Voy a revisar capacidad después de comer."), line("A", "Lisa", "Are you gonna call the customer too?", "¿También vas a llamar al cliente?"), line("B", "Marco", "Yes, once I have a new date.", "Sí, cuando tenga una fecha nueva.")],
        question: "¿Qué hará Marco después de comer?", options: ["Revisar capacidad", "Comer con el cliente", "Cancelar la orden"], answer: 0,
        chunks: [chunk("going to", "GON-na", "ir a / va a"), chunk("What are you gonna", "whad-arya-GON-na", "¿Qué vas a...?"), chunk("once I have", "wuns-eye-HAVE", "cuando tenga")],
        responsePrompt: "Di que revisarás capacidad y luego llamarás.", modelResponse: "I'm gonna check capacity, then call the customer.", modelResponseEs: "Voy a revisar capacidad y luego llamar al cliente."
      },
      {
        title: "Want to → wanna", context: "Deciden si revisar un problema juntos.", objective: "Reconocer una invitación rápida.",
        dialogue: [line("A", "Sam", "Do you wanna look at the schedule now?", "¿Quieres revisar el programa ahora?"), line("B", "Marco", "Sure. I wanna understand where we lost time.", "Claro. Quiero entender dónde perdimos tiempo."), line("A", "Sam", "Let's start with the first shift.", "Empecemos con el primer turno."), line("B", "Marco", "Okay. Pull up yesterday's plan.", "Bien. Abre el plan de ayer.")],
        question: "¿Con qué empezarán?", options: ["El primer turno", "El segundo turno", "La compra"], answer: 0,
        chunks: [chunk("Do you want to", "dya-WAN-na", "¿Quieres...?"), chunk("where we lost time", "where-we-LOST-time", "dónde perdimos tiempo"), chunk("pull up", "pull-UP", "abrir/mostrar")],
        responsePrompt: "Acepta revisar el programa ahora.", modelResponse: "Sure. Let's look at the schedule now.", modelResponseEs: "Claro. Revisemos el programa ahora."
      },
      {
        title: "Let me → lemme", context: "Alguien ofrece verificar un dato.", objective: "Entender una oferta y fijar respuesta.",
        dialogue: [line("A", "Supplier", "Lemme check the tracking number for you.", "Déjame revisar el número de rastreo."), line("B", "Marco", "Thanks. I need the latest status.", "Gracias. Necesito el estado más reciente."), line("A", "Supplier", "It shows the truck is at the border.", "Indica que el camión está en la frontera."), line("B", "Marco", "Can you get back to me when it clears?", "¿Puedes avisarme cuando cruce?")],
        question: "¿Dónde está el camión?", options: ["En el almacén", "En la frontera", "Con el cliente"], answer: 1,
        chunks: [chunk("Let me", "LEM-me", "Déjame"), chunk("It shows", "it-SHOWS", "Indica/Muestra"), chunk("get back to me", "get-BACK-tuh-me", "avísame/respóndeme")],
        responsePrompt: "Pide que te avisen cuando cruce.", modelResponse: "Please get back to me when the truck clears.", modelResponseEs: "Avísame cuando cruce el camión."
      },
      {
        title: "Could have → could've", context: "Analizan una oportunidad perdida.", objective: "Reconocer una contracción y enfocarte en resultado.",
        dialogue: [line("A", "David", "We could've avoided this delay.", "Pudimos haber evitado este retraso."), line("B", "Marco", "Maybe. The material arrived later than expected.", "Tal vez. El material llegó más tarde de lo esperado."), line("A", "David", "We could've ordered it a day earlier.", "Pudimos haberlo pedido un día antes."), line("B", "Marco", "I agree. Let's change the reorder point.", "Estoy de acuerdo. Cambiemos el punto de reorden.")],
        question: "¿Qué cambiarán?", options: ["El proveedor", "El punto de reorden", "El turno"], answer: 1,
        chunks: [chunk("could have", "COULD-uv", "pudo/pudimos haber"), chunk("later than expected", "later-than-ex-PEC-ted", "más tarde de lo esperado"), chunk("a day earlier", "uh-day-EAR-lee-er", "un día antes")],
        responsePrompt: "Di que deben ordenar un día antes.", modelResponse: "We should order the material one day earlier.", modelResponseEs: "Debemos pedir el material un día antes."
      },
      {
        title: "Misión: velocidad de juego", context: "Escuchas varias reducciones en una actualización.", objective: "Buscar acción, responsable y límite; no todas las palabras.",
        dialogue: [line("A", "Lisa", "I'm gonna call purchasing and see if they can get back to us before the meeting.", "Voy a llamar a compras y ver si pueden respondernos antes de la junta."), line("B", "Marco", "Did you already send them the order number?", "¿Ya les enviaste el número de orden?"), line("A", "Lisa", "Yeah. Lemme forward you the email too.", "Sí. Déjame reenviarte también el correo."), line("B", "Marco", "Perfect. I wanna review it before they call.", "Perfecto. Quiero revisarlo antes de que llamen.")],
        question: "¿A quién llamará Lisa?", options: ["Al cliente", "A compras", "A calidad"], answer: 1,
        chunks: [chunk("I'm gonna", "I'm-GON-na", "Voy a"), chunk("Did you already", "did-ja-all-READY", "¿Ya...?"), chunk("Lemme forward you", "LEM-me-FOR-ward-ya", "Déjame reenviarte")],
        responsePrompt: "Resume acción y límite.", modelResponse: "Lisa will call purchasing before the meeting.", modelResponseEs: "Lisa llamará a compras antes de la junta."
      },
    ],
  },
  {
    title: "Carrera y conversación profesional",
    objective: "Explicar experiencia con historias breves, concretas y comprensibles.",
    missions: [
      {
        title: "Presentación útil", context: "Conoces a un gerente de otra planta.", objective: "Presentarte con función, experiencia y propósito.",
        dialogue: [line("A", "Manager", "Nice to meet you, Marco. What do you do?", "Mucho gusto, Marco. ¿A qué te dedicas?"), line("B", "Marco", "I'm a production planner with experience in manufacturing and logistics.", "Soy planeador de producción con experiencia en manufactura y logística."), line("A", "Manager", "What kind of operation do you support?", "¿Qué tipo de operación apoyas?"), line("B", "Marco", "A manufacturing plant in Tijuana. I coordinate priorities, capacity, and materials.", "Una planta de manufactura en Tijuana. Coordino prioridades, capacidad y materiales.")],
        question: "¿Qué coordina Marco?", options: ["Ventas y mercadotecnia", "Prioridades, capacidad y materiales", "Sólo embarques"], answer: 1,
        chunks: [chunk("What do you do?", "whad-dya-DO", "¿A qué te dedicas?"), chunk("with experience in", "with-ex-PEER-ee-ence-in", "con experiencia en"), chunk("What kind of", "what-KIND-uv", "¿Qué tipo de...?")],
        responsePrompt: "Preséntate con puesto y dos áreas de experiencia.", modelResponse: "I'm a production planner with experience in manufacturing and logistics.", modelResponseEs: "Soy planeador de producción con experiencia en manufactura y logística."
      },
      {
        title: "Responsabilidad principal", context: "Una entrevista profundiza en tu función.", objective: "Explicar trabajo sin una lista memorizada.",
        dialogue: [line("A", "Interviewer", "What's your main responsibility?", "¿Cuál es tu responsabilidad principal?"), line("B", "Marco", "I balance customer demand with capacity and material availability.", "Equilibro la demanda del cliente con capacidad y disponibilidad de material."), line("A", "Interviewer", "How do you handle urgent orders?", "¿Cómo manejas órdenes urgentes?"), line("B", "Marco", "I evaluate the risk, set priorities, and follow up with each area.", "Evalúo el riesgo, establezco prioridades y doy seguimiento con cada área.")],
        question: "¿Qué hace primero con una orden urgente?", options: ["La cancela", "Evalúa el riesgo", "Llama al cliente"], answer: 1,
        chunks: [chunk("What's your main", "whats-yer-MAIN", "¿Cuál es tu principal...?"), chunk("How do you handle", "how-dya-HAN-dle", "¿Cómo manejas...?"), chunk("follow up with", "follow-UP-with", "dar seguimiento con")],
        responsePrompt: "Explica tu responsabilidad en una oración.", modelResponse: "I balance demand, capacity, and material availability.", modelResponseEs: "Equilibro demanda, capacidad y disponibilidad de material."
      },
      {
        title: "Historia: problema y acción", context: "Te piden un ejemplo concreto.", objective: "Usar estructura situación–acción–resultado.",
        dialogue: [line("A", "Interviewer", "Tell me about a difficult problem you solved.", "Háblame de un problema difícil que resolviste."), line("B", "Marco", "We had a material shortage on an urgent order.", "Tuvimos un faltante de material en una orden urgente."), line("A", "Interviewer", "What did you do?", "¿Qué hiciste?"), line("B", "Marco", "I revised the schedule, protected the priority, and completed it on time.", "Revisé el programa, protegí la prioridad y la completamos a tiempo.")],
        question: "¿Cuál fue el resultado?", options: ["Se canceló la orden", "La completaron a tiempo", "Compraron otra máquina"], answer: 1,
        chunks: [chunk("Tell me about", "TEL-me-about", "Háblame de"), chunk("What did you do?", "what-did-ja-DO", "¿Qué hiciste?"), chunk("on time", "on-TIME", "a tiempo")],
        responsePrompt: "Da problema y resultado en dos frases.", modelResponse: "We had a material shortage. I revised the plan and completed the order on time.", modelResponseEs: "Tuvimos un faltante de material. Revisé el plan y completamos la orden a tiempo."
      },
      {
        title: "Fortaleza demostrable", context: "Te preguntan por una fortaleza.", objective: "Conectar fortaleza con una conducta observable.",
        dialogue: [line("A", "Interviewer", "What's one of your main strengths?", "¿Cuál es una de tus principales fortalezas?"), line("B", "Marco", "I stay organized and find practical solutions under pressure.", "Me mantengo organizado y encuentro soluciones prácticas bajo presión."), line("A", "Interviewer", "Can you give me a quick example?", "¿Puedes darme un ejemplo breve?"), line("B", "Marco", "When conditions change, I reorganize priorities and communicate the impact.", "Cuando cambian las condiciones, reorganizo prioridades y comunico el impacto.")],
        question: "¿Qué hace Marco cuando cambian las condiciones?", options: ["Espera instrucciones", "Reorganiza prioridades y comunica", "Trabaja sin avisar"], answer: 1,
        chunks: [chunk("one of your", "one-uv-yer", "una de tus"), chunk("under pressure", "under-PRESH-er", "bajo presión"), chunk("Can you give me", "kin-ya-GIVE-me", "¿Puedes darme...?")],
        responsePrompt: "Menciona una fortaleza y un ejemplo.", modelResponse: "I solve problems under pressure. I reorganize priorities when conditions change.", modelResponseEs: "Resuelvo problemas bajo presión. Reorganizo prioridades cuando cambian las condiciones."
      },
      {
        title: "Motivación profesional", context: "Explicas por qué buscas otra oportunidad.", objective: "Responder en positivo y conectar con aportación.",
        dialogue: [line("A", "Interviewer", "Why are you interested in this position?", "¿Por qué te interesa este puesto?"), line("B", "Marco", "I'm ready to grow and use more of my planning experience.", "Estoy listo para crecer y utilizar más mi experiencia en planeación."), line("A", "Interviewer", "What would you bring to the team?", "¿Qué aportarías al equipo?"), line("B", "Marco", "Strong follow-up, practical problem solving, and manufacturing knowledge.", "Seguimiento sólido, solución práctica de problemas y conocimiento de manufactura.")],
        question: "¿Qué quiere utilizar más Marco?", options: ["Su experiencia en planeación", "Su experiencia en ventas", "Su tiempo libre"], answer: 0,
        chunks: [chunk("Why are you interested", "why-r-ya-IN-trested", "¿Por qué te interesa...?"), chunk("ready to grow", "READY-tuh-grow", "listo para crecer"), chunk("bring to the team", "bring-tuh-thuh-TEAM", "aportar al equipo")],
        responsePrompt: "Di por qué te interesa el puesto.", modelResponse: "I'm ready to grow and use more of my experience.", modelResponseEs: "Estoy listo para crecer y utilizar más de mi experiencia."
      },
      {
        title: "Misión: conversación completa", context: "Cierras una entrevista con una pregunta propia.", objective: "Escuchar, responder y tomar la iniciativa.",
        dialogue: [line("A", "Interviewer", "Do you have any questions for me?", "¿Tienes alguna pregunta para mí?"), line("B", "Marco", "Yes. What are the biggest planning challenges in the first three months?", "Sí. ¿Cuáles son los mayores retos de planeación en los primeros tres meses?"), line("A", "Interviewer", "Capacity changes and supplier delays are the main ones.", "Los cambios de capacidad y retrasos de proveedores son los principales."), line("B", "Marco", "That matches my experience. How is success measured?", "Eso coincide con mi experiencia. ¿Cómo se mide el éxito?")],
        question: "¿Cuáles son los retos principales?", options: ["Capacidad y retrasos de proveedores", "Contratación y ventas", "Idioma y viajes"], answer: 0,
        chunks: [chunk("Do you have any", "dya-have-ANY", "¿Tienes alguna...?"), chunk("biggest challenges", "BIG-gest-CHAL-len-jes", "mayores retos"), chunk("How is success measured?", "how-is-success-MEAS-ured", "¿Cómo se mide el éxito?")],
        responsePrompt: "Haz una pregunta sobre los retos del puesto.", modelResponse: "What are the biggest challenges in this position?", modelResponseEs: "¿Cuáles son los mayores retos de este puesto?"
      },
    ],
  },
  {
    title: "Juego completo",
    objective: "Integrar oído, reparación y respuesta en situaciones nuevas a velocidad natural.",
    missions: [
      {
        title: "Cambio de cliente", context: "El cliente adelanta una fecha y asignas acciones.", objective: "Captar cambio, tres acciones y plazo.",
        dialogue: [line("A", "Customer", "We've moved the deadline from Friday to Thursday morning.", "Movimos la fecha límite del viernes al jueves por la mañana."), line("B", "Marco", "Thursday morning. Let me check capacity and material.", "Jueves por la mañana. Déjame revisar capacidad y material."), line("A", "Customer", "Please confirm before noon today.", "Confirma antes del mediodía de hoy."), line("B", "Marco", "I will. I'll also call the supplier right now.", "Lo haré. También llamaré al proveedor ahora.")],
        question: "¿Cuál es la nueva fecha límite?", options: ["Viernes", "Jueves por la mañana", "Hoy al mediodía"], answer: 1,
        chunks: [chunk("We've moved", "weev-MOVED", "Hemos movido"), chunk("from Friday to Thursday", "frum-FRI-day-tuh-THURS-day", "del viernes al jueves"), chunk("right now", "right-NOW", "ahora mismo")],
        responsePrompt: "Confirma nueva fecha y tus primeras acciones.", modelResponse: "The new deadline is Thursday morning. I'll check capacity and material.", modelResponseEs: "La nueva fecha es jueves por la mañana. Revisaré capacidad y material."
      },
      {
        title: "Cruce bloqueado", context: "Una discrepancia documental detiene el camión.", objective: "Entender causa, estado y corrección.",
        dialogue: [line("A", "Broker", "Customs found a different item description, so the truck can't cross yet.", "Aduanas encontró una descripción diferente, así que el camión aún no puede cruzar."), line("B", "Marco", "Which document needs to be corrected?", "¿Qué documento necesita corrección?"), line("A", "Broker", "The invoice. The packing list is correct.", "La factura. La lista de empaque está correcta."), line("B", "Marco", "I'll correct the invoice and send it again now.", "Corregiré la factura y la enviaré nuevamente ahora.")],
        question: "¿Qué documento debe corregirse?", options: ["Factura", "Lista de empaque", "Pedimento"], answer: 0,
        chunks: [chunk("can't cross yet", "cant-CROSS-yet", "todavía no puede cruzar"), chunk("needs to be corrected", "needs-tuh-be-corrected", "necesita corregirse"), chunk("send it again", "sen-dit-uh-GAIN", "enviarlo otra vez")],
        responsePrompt: "Di qué corregirás y enviarás.", modelResponse: "I'll correct the invoice and resend it now.", modelResponseEs: "Corregiré la factura y la reenviaré ahora."
      },
      {
        title: "Dos problemas a la vez", context: "Producción y proveedor fallan simultáneamente.", objective: "Priorizar y comunicar sin perder el hilo.",
        dialogue: [line("A", "David", "Machine two is down, and the replacement material is also late.", "La máquina dos está detenida y el material de reemplazo también está retrasado."), line("B", "Marco", "Which issue affects the urgent order first?", "¿Qué problema afecta primero la orden urgente?"), line("A", "David", "The machine. We have enough material for today.", "La máquina. Tenemos suficiente material para hoy."), line("B", "Marco", "Then I'll move the order to machine five and call maintenance.", "Entonces moveré la orden a máquina cinco y llamaré a mantenimiento.")],
        question: "¿Qué problema afecta primero la orden urgente?", options: ["La máquina", "El material", "El cliente"], answer: 0,
        chunks: [chunk("is also late", "iz-ALL-so-late", "también está tarde"), chunk("affects the", "uh-FECTS-thuh", "afecta el/la"), chunk("enough material", "e-NUFF-ma-TEER-ee-al", "material suficiente")],
        responsePrompt: "Di tu decisión y dos acciones.", modelResponse: "I'll move the urgent order to machine five and call maintenance.", modelResponseEs: "Moveré la orden urgente a máquina cinco y llamaré a mantenimiento."
      },
      {
        title: "Llamada con ruido mental", context: "Te dan empresa, orden, cantidad y límite.", objective: "Usar toma de notas categórica y confirmación.",
        dialogue: [line("A", "Caller", "This is Eric from Northstar. We need eighty units on order seven twenty by Wednesday.", "Soy Eric de Northstar. Necesitamos 80 unidades en la orden 720 para el miércoles."), line("B", "Marco", "I have Northstar, order seven twenty, eighty units by Wednesday.", "Tengo Northstar, orden 720, 80 unidades para el miércoles."), line("A", "Eric", "Correct. Can you confirm capacity today?", "Correcto. ¿Puedes confirmar capacidad hoy?"), line("B", "Marco", "Yes. I'll call you back before three.", "Sí. Te devolveré la llamada antes de las tres.")],
        question: "¿Cuándo devolverá la llamada Marco?", options: ["El miércoles", "Antes de las tres hoy", "Después de las ocho"], answer: 1,
        chunks: [chunk("We need eighty", "we-NEED-EIGH-dee", "Necesitamos 80"), chunk("Can you confirm", "kin-ya-confirm", "¿Puedes confirmar?"), chunk("call you back", "call-ya-BACK", "devolverte la llamada")],
        responsePrompt: "Confirma empresa, orden y cantidad.", modelResponse: "Northstar, order seven twenty, eighty units. I'll confirm today.", modelResponseEs: "Northstar, orden 720, 80 unidades. Confirmaré hoy."
      },
      {
        title: "Conversación social inesperada", context: "Un visitante inicia una charla antes de la junta.", objective: "Responder sin guion y conectar dos ideas.",
        dialogue: [line("A", "Visitor", "Is this your first time working with our team?", "¿Es la primera vez que trabajas con nuestro equipo?"), line("B", "Marco", "Yes, but I've worked with similar operations for years.", "Sí, pero he trabajado con operaciones similares durante años."), line("A", "Visitor", "How are you finding Tijuana?", "¿Qué te parece Tijuana?"), line("B", "Marco", "It's busy, but I like the people and the food.", "Es activa, pero me gustan la gente y la comida.")],
        question: "¿Es la primera vez que trabaja con ese equipo?", options: ["Sí", "No", "No se menciona"], answer: 0,
        chunks: [chunk("Is this your first time", "iz-this-yer-FIRST-time", "¿Es tu primera vez...?"), chunk("I've worked with", "Ive-WORKT-with", "He trabajado con"), chunk("How are you finding", "how-r-ya-FIND-ing", "¿Qué te parece...?")],
        responsePrompt: "Responde que es la primera vez, pero tienes experiencia similar.", modelResponse: "Yes, it's my first time, but I have experience with similar operations.", modelResponseEs: "Sí, es mi primera vez, pero tengo experiencia con operaciones similares."
      },
      {
        title: "Evaluación final", context: "Una situación integrada exige escuchar, priorizar y responder.", objective: "Demostrar comprensión funcional sin depender de transcripción.",
        dialogue: [line("A", "Manager", "The customer moved the deadline to Thursday. Machine four is still down, and the supplier can only deliver half the material today.", "El cliente movió la fecha al jueves. La máquina cuatro sigue detenida y el proveedor sólo puede entregar la mitad del material hoy."), line("B", "Marco", "I'll check capacity on machine two and prioritize the urgent quantity.", "Revisaré capacidad en máquina dos y priorizaré la cantidad urgente."), line("A", "Manager", "Good. Send me the recovery plan before one.", "Bien. Envíame el plan de recuperación antes de la una."), line("B", "Marco", "Understood. I'll confirm material and send the plan before one.", "Entendido. Confirmaré material y enviaré el plan antes de la una.")],
        question: "¿Qué debe enviar Marco antes de la una?", options: ["Una cotización", "El plan de recuperación", "La factura"], answer: 1,
        chunks: [chunk("is still down", "iz-still-DOWN", "sigue detenida"), chunk("can only deliver half", "kin-only-de-LIV-er-half", "sólo puede entregar la mitad"), chunk("recovery plan", "ree-COV-er-y-plan", "plan de recuperación")],
        responsePrompt: "Resume problema, decisión y plazo.", modelResponse: "Machine four is down, so I'll check machine two and send a recovery plan before one.", modelResponseEs: "La máquina cuatro está detenida; revisaré máquina dos y enviaré un plan antes de la una."
      },
    ],
  },
  {
    title: "Comer y comprar de verdad",
    objective: "Resolver pedidos, tallas, colores, precios y cambios usando frases completas de la vida diaria.",
    missions: [
      {
        title: "Pedir una pizza por teléfono", context: "Llamas a una pizzería para hacer un pedido.", objective: "Pedir tamaño, ingredientes y confirmar el precio.", languageFocus: "I'd like… · Can I get…? · with / without",
        dialogue: [line("A", "Clerk", "Thanks for calling Tony's Pizza. What can I get for you?", "Gracias por llamar a Tony's Pizza. ¿Qué te puedo ofrecer?"), line("B", "Marco", "I'd like a large pepperoni pizza with extra cheese, please.", "Quisiera una pizza grande de pepperoni con queso extra, por favor."), line("A", "Clerk", "Sure. Is that for pickup or delivery?", "Claro. ¿Es para recoger o para entrega?"), line("B", "Marco", "Delivery, please. How much is the total?", "Entrega, por favor. ¿Cuánto es el total?")],
        question: "¿Qué tipo de pizza pidió Marco?", options: ["Grande de pepperoni con queso extra", "Mediana vegetariana", "Grande sin queso"], answer: 0,
        chunks: [chunk("What can I get for you?", "whad-kin-eye-GET-fer-ya", "¿Qué te puedo ofrecer?"), chunk("I'd like a", "eye-d-LIKE-uh", "Quisiera una"), chunk("pickup or delivery", "PICK-up-er-de-LIV-er-y", "recoger o entrega")],
        responsePrompt: "Pide una pizza mediana de queso, sin cebolla.", modelResponse: "I'd like a medium cheese pizza without onions, please.", modelResponseEs: "Quisiera una pizza mediana de queso, sin cebolla, por favor."
      },
      {
        title: "Dar el domicilio", context: "La pizzería necesita confirmar dónde entregar.", objective: "Decir calle, número y una referencia sencilla.", languageFocus: "at + dirección · on + calle · next to",
        dialogue: [line("A", "Clerk", "What's the delivery address?", "¿Cuál es el domicilio de entrega?"), line("B", "Marco", "It's 1840 Oak Street, apartment twelve.", "Es Oak Street 1840, departamento 12."), line("A", "Clerk", "Is that the building next to the pharmacy?", "¿Es el edificio junto a la farmacia?"), line("B", "Marco", "Yes. Please call me when the driver is outside.", "Sí. Por favor llámame cuando el repartidor esté afuera.")],
        question: "¿Cuál es la referencia?", options: ["Frente al banco", "Junto a la farmacia", "Detrás del restaurante"], answer: 1,
        chunks: [chunk("What's the address?", "whats-thee-ADDRESS", "¿Cuál es el domicilio?"), chunk("next to the", "NEXT-tuh-thuh", "junto a"), chunk("when the driver's outside", "when-thuh-driverz-out-SIDE", "cuando el repartidor esté afuera")],
        responsePrompt: "Da una dirección y menciona que está frente al banco.", modelResponse: "It's 25 Pine Avenue, across from the bank.", modelResponseEs: "Es Pine Avenue 25, frente al banco."
      },
      {
        title: "Comprar zapatos", context: "Buscas zapatos cómodos en una tienda.", objective: "Preguntar por talla, color y disponibilidad.", languageFocus: "Do you have…? · in size / in black",
        dialogue: [line("A", "Clerk", "Hi. Are you looking for anything in particular?", "Hola. ¿Buscas algo en particular?"), line("B", "Marco", "Yes, I need comfortable black shoes for work.", "Sí, necesito zapatos negros cómodos para el trabajo."), line("A", "Clerk", "We have these in black and brown. What size are you?", "Tenemos estos en negro y café. ¿Qué talla eres?"), line("B", "Marco", "I'm a size ten. Can I try on the black pair?", "Soy talla diez. ¿Puedo probarme el par negro?")],
        question: "¿Qué zapatos quiere probarse?", options: ["Cafés talla 9", "Negros talla 10", "Negros talla 12"], answer: 1,
        chunks: [chunk("looking for", "LOOK-ing-fer", "buscando"), chunk("What size are you?", "what-SIZE-er-ya", "¿Qué talla eres?"), chunk("try on", "TRY-on", "probarse")],
        responsePrompt: "Pregunta si tienen ese modelo en azul, talla nueve.", modelResponse: "Do you have this style in blue, size nine?", modelResponseEs: "¿Tienen este modelo en azul, talla nueve?"
      },
      {
        title: "¿Te quedan bien?", context: "Te pruebas los zapatos y la dependienta pregunta cómo se sienten.", objective: "Describir comodidad, talla y partes del zapato.", languageFocus: "They are… · They feel… · too + adjetivo",
        dialogue: [line("A", "Clerk", "How do they feel?", "¿Cómo se sienten?"), line("B", "Marco", "The left shoe feels good, but the right one is too tight.", "El zapato izquierdo se siente bien, pero el derecho está demasiado apretado."), line("A", "Clerk", "I can bring you a half size larger.", "Puedo traerte media talla más grande."), line("B", "Marco", "That would be great. The color is perfect.", "Eso estaría muy bien. El color es perfecto.")],
        question: "¿Cuál zapato está apretado?", options: ["El izquierdo", "El derecho", "Los dos"], answer: 1,
        chunks: [chunk("How do they feel?", "how-duh-they-FEEL", "¿Cómo se sienten?"), chunk("too tight", "too-TIGHT", "demasiado apretado"), chunk("half size larger", "half-size-LAR-ger", "media talla más grande")],
        responsePrompt: "Di que están cómodos, pero un poco grandes.", modelResponse: "They're comfortable, but they're a little too big.", modelResponseEs: "Son cómodos, pero están un poco grandes."
      },
      {
        title: "Cambiar una compra", context: "Regresas a la tienda con unos zapatos que no te quedaron.", objective: "Explicar qué compraste y pedir un cambio.", languageFocus: "I bought… · They didn't fit · I'd like to exchange…",
        dialogue: [line("A", "Clerk", "How can I help you today?", "¿Cómo puedo ayudarte hoy?"), line("B", "Marco", "I bought these shoes yesterday, but they didn't fit.", "Compré estos zapatos ayer, pero no me quedaron."), line("A", "Clerk", "No problem. Would you like a refund or an exchange?", "No hay problema. ¿Quieres un reembolso o un cambio?"), line("B", "Marco", "I'd like to exchange them for a larger size.", "Quisiera cambiarlos por una talla más grande.")],
        question: "¿Qué quiere Marco?", options: ["Un reembolso", "Una talla más grande", "Otro color más pequeño"], answer: 1,
        chunks: [chunk("I bought these", "eye-BAWT-theez", "Compré estos"), chunk("didn't fit", "DID-nt-FIT", "no quedaron"), chunk("exchange them for", "ex-CHANGE-em-fer", "cambiarlos por")],
        responsePrompt: "Di que compraste la camisa ayer y quieres otro color.", modelResponse: "I bought this shirt yesterday. I'd like to exchange it for another color.", modelResponseEs: "Compré esta camisa ayer. Quisiera cambiarla por otro color."
      },
      {
        title: "Misión: pedido completo", context: "Pides comida, eliges una opción y corriges un detalle.", objective: "Mantener una conversación natural de principio a fin.", languageFocus: "I'll have… · Could you make it…? · That's all",
        dialogue: [line("A", "Server", "Are you ready to order, or do you need another minute?", "¿Estás listo para ordenar o necesitas otro minuto?"), line("B", "Marco", "I'm ready. I'll have the chicken sandwich and a small salad.", "Estoy listo. Quiero el sándwich de pollo y una ensalada pequeña."), line("A", "Server", "Would you like fries with that?", "¿Quieres papas con eso?"), line("B", "Marco", "No, thanks. Could you make the salad without tomatoes?", "No, gracias. ¿Podrías preparar la ensalada sin tomates?")],
        question: "¿Qué cambio pidió?", options: ["Sin pollo", "Sin tomates", "Con papas"], answer: 1,
        chunks: [chunk("Are you ready to order?", "arya-ready-duh-ORDER", "¿Estás listo para ordenar?"), chunk("I'll have the", "ahl-HAVE-thuh", "Quiero el/la"), chunk("Would you like", "wood-ja-LIKE", "¿Te gustaría?")],
        responsePrompt: "Ordena una hamburguesa sin cebolla y agua.", modelResponse: "I'll have a hamburger without onions and a glass of water, please.", modelResponseEs: "Quiero una hamburguesa sin cebolla y un vaso de agua, por favor."
      },
    ],
  },
  {
    title: "Ubicación, rutas y cuerpo",
    objective: "Preguntar domicilios, explicar trayectos y describir ubicaciones y molestias físicas.",
    missions: [
      {
        title: "Preguntar un domicilio", context: "Buscas una clínica en una zona que no conoces.", objective: "Preguntar dónde está y confirmar una referencia.", languageFocus: "Where is…? · Is it near…? · across from",
        dialogue: [line("A", "Marco", "Excuse me, where's the Green Valley Clinic?", "Disculpe, ¿dónde está la clínica Green Valley?"), line("B", "Local", "It's on Pine Street, across from the library.", "Está en Pine Street, frente a la biblioteca."), line("A", "Marco", "Is it near the traffic light?", "¿Está cerca del semáforo?"), line("B", "Local", "Yes. It's the white building on the corner.", "Sí. Es el edificio blanco en la esquina.")],
        question: "¿Cómo identifica Marco la clínica?", options: ["Edificio blanco en la esquina", "Edificio rojo junto al banco", "Casa azul detrás del parque"], answer: 0,
        chunks: [chunk("where's the", "WHERE-zthuh", "¿dónde está?"), chunk("across from", "uh-CROSS-frum", "frente a"), chunk("on the corner", "on-thuh-COR-ner", "en la esquina")],
        responsePrompt: "Pregunta dónde está la farmacia y si está cerca del banco.", modelResponse: "Excuse me, where's the pharmacy? Is it near the bank?", modelResponseEs: "Disculpe, ¿dónde está la farmacia? ¿Está cerca del banco?"
      },
      {
        title: "Explicar cómo llegar", context: "Un visitante te pide la ruta a una oficina.", objective: "Dar pasos cortos en el orden correcto.", languageFocus: "Go straight · turn left/right · at the light",
        dialogue: [line("A", "Visitor", "How do I get to the main office from here?", "¿Cómo llego a la oficina principal desde aquí?"), line("B", "Marco", "Go straight for two blocks and turn left at the light.", "Sigue derecho dos cuadras y da vuelta a la izquierda en el semáforo."), line("A", "Visitor", "Is it before or after the gas station?", "¿Está antes o después de la gasolinera?"), line("B", "Marco", "After it. The office will be on your right.", "Después. La oficina estará a tu derecha.")],
        question: "¿Dónde debe girar?", options: ["A la derecha en la gasolinera", "A la izquierda en el semáforo", "En la segunda oficina"], answer: 1,
        chunks: [chunk("How do I get to", "how-duh-eye-GET-tuh", "¿Cómo llego a?"), chunk("turn left at", "turn-LEFT-at", "gira a la izquierda en"), chunk("on your right", "on-yer-RIGHT", "a tu derecha")],
        responsePrompt: "Indica: derecho una cuadra, derecha en la esquina, banco a la izquierda.", modelResponse: "Go straight for one block, turn right at the corner, and the bank is on your left.", modelResponseEs: "Sigue derecho una cuadra, gira a la derecha en la esquina y el banco está a tu izquierda."
      },
      {
        title: "Corregir una ruta", context: "El conductor tomó una calle equivocada.", objective: "Detener, corregir y reorientar con calma.", languageFocus: "You passed… · go back · take the next…",
        dialogue: [line("A", "Driver", "Is the hotel near this shopping center?", "¿El hotel está cerca de este centro comercial?"), line("B", "Marco", "We passed it. Go back to the last intersection.", "Ya lo pasamos. Regresa a la última intersección."), line("A", "Driver", "Should I take the first right?", "¿Debo tomar la primera a la derecha?"), line("B", "Marco", "Yes. Then the hotel is on the left, behind the restaurant.", "Sí. Después el hotel está a la izquierda, detrás del restaurante.")],
        question: "¿Dónde está el hotel?", options: ["Detrás del restaurante", "Dentro del centro comercial", "Frente a la gasolinera"], answer: 0,
        chunks: [chunk("We passed it", "we-PASST-it", "Ya lo pasamos"), chunk("go back to", "go-BACK-tuh", "regresa a"), chunk("behind the", "be-HIND-thuh", "detrás de")],
        responsePrompt: "Di que ya pasaron el lugar y deben regresar al semáforo.", modelResponse: "We passed it. Please go back to the traffic light.", modelResponseEs: "Ya lo pasamos. Por favor regresa al semáforo."
      },
      {
        title: "Partes del cuerpo en la farmacia", context: "Explicas una molestia para pedir ayuda.", objective: "Nombrar la parte del cuerpo, duración e intensidad.", languageFocus: "My … hurts · I have a… · for two days",
        dialogue: [line("A", "Pharmacist", "What seems to be the problem?", "¿Cuál parece ser el problema?"), line("B", "Marco", "My throat hurts, and I have a headache.", "Me duele la garganta y tengo dolor de cabeza."), line("A", "Pharmacist", "How long have you felt this way?", "¿Desde cuándo te sientes así?"), line("B", "Marco", "For two days. I don't have a fever.", "Desde hace dos días. No tengo fiebre.")],
        question: "¿Qué molestias tiene Marco?", options: ["Dolor de garganta y cabeza", "Dolor de espalda y fiebre", "Dolor de rodilla"], answer: 0,
        chunks: [chunk("What seems to be", "what-SEEMS-tuh-be", "¿Cuál parece ser?"), chunk("My throat hurts", "my-THROAT-hurts", "Me duele la garganta"), chunk("How long have you", "how-LONG-uv-ya", "¿Desde cuándo?")],
        responsePrompt: "Di que te duele la espalda desde ayer.", modelResponse: "My back has hurt since yesterday.", modelResponseEs: "Me duele la espalda desde ayer."
      },
      {
        title: "Over, under, in, on, at", context: "Buscan herramientas antes de comenzar un trabajo.", objective: "Ubicar objetos sin señalar físicamente.", languageFocus: "over / under / in / on / at",
        dialogue: [line("A", "Luis", "Where did you put the safety glasses?", "¿Dónde pusiste los lentes de seguridad?"), line("B", "Marco", "They're in the blue box, under the workbench.", "Están en la caja azul, debajo del banco de trabajo."), line("A", "Luis", "And the checklist?", "¿Y la lista de verificación?"), line("B", "Marco", "It's on the wall, right over the first-aid kit.", "Está en la pared, justo sobre el botiquín.")],
        question: "¿Dónde están los lentes?", options: ["Sobre la pared", "En la caja azul bajo el banco", "Dentro del botiquín"], answer: 1,
        chunks: [chunk("Where did you put", "where-did-ja-PUT", "¿Dónde pusiste?"), chunk("under the", "UN-der-thuh", "debajo de"), chunk("right over", "right-OH-ver", "justo sobre")],
        responsePrompt: "Di que las llaves están sobre la mesa, junto al teléfono.", modelResponse: "The keys are on the table, next to the phone.", modelResponseEs: "Las llaves están sobre la mesa, junto al teléfono."
      },
      {
        title: "Misión: guiar a una persona", context: "Das una ruta con entrada, piso y ubicación final.", objective: "Combinar movimiento y preposiciones sin traducir palabra por palabra.", languageFocus: "through · up/down · on the second floor · at the end",
        dialogue: [line("A", "Guest", "I'm at the front entrance. Where's the training room?", "Estoy en la entrada principal. ¿Dónde está el salón de capacitación?"), line("B", "Marco", "Walk through the lobby and take the stairs to the second floor.", "Cruza el vestíbulo y sube por las escaleras al segundo piso."), line("A", "Guest", "Do I turn left at the top?", "¿Giro a la izquierda al llegar arriba?"), line("B", "Marco", "Yes. It's the last door on the right, next to the elevator.", "Sí. Es la última puerta a la derecha, junto al elevador.")],
        question: "¿Dónde está el salón?", options: ["Primer piso junto a recepción", "Segunda planta, última puerta a la derecha", "Detrás de la entrada"], answer: 1,
        chunks: [chunk("walk through", "walk-THROO", "cruza/camina por"), chunk("at the top", "at-thuh-TOP", "al llegar arriba"), chunk("next to the elevator", "next-tuh-thee-EL-uh-vay-ter", "junto al elevador")],
        responsePrompt: "Da una ruta corta desde la entrada hasta el elevador.", modelResponse: "Walk through the lobby. The elevator is at the end, on your left.", modelResponseEs: "Cruza el vestíbulo. El elevador está al final, a tu izquierda."
      },
    ],
  },
  {
    title: "Verbos en el tiempo real",
    objective: "Usar to be, pasado y futuro para contar qué ocurrió y decir qué ocurrirá después.",
    missions: [
      {
        title: "To be en el presente", context: "Te presentas con un nuevo vecino.", objective: "Usar am, is y are dentro de información personal.", languageFocus: "I am · you are · he/she/it is · we/they are",
        dialogue: [line("A", "Neighbor", "Hi, I'm Rachel. Are you new to the building?", "Hola, soy Rachel. ¿Eres nuevo en el edificio?"), line("B", "Marco", "Yes, I am. My family and I are in apartment eight.", "Sí. Mi familia y yo estamos en el departamento ocho."), line("A", "Rachel", "I'm in apartment ten. The neighbors are very friendly.", "Estoy en el departamento diez. Los vecinos son muy amables."), line("B", "Marco", "That's good to hear. The building is really quiet.", "Qué bueno saberlo. El edificio es muy tranquilo.")],
        question: "¿Dónde vive Marco?", options: ["Departamento 8", "Departamento 10", "Casa 8"], answer: 0,
        chunks: [chunk("I'm Rachel", "aim-RAY-chul", "Soy Rachel"), chunk("Are you new?", "arya-NEW", "¿Eres nuevo?"), chunk("The neighbors are", "thuh-NEIGH-burz-er", "Los vecinos son")],
        responsePrompt: "Preséntate y di dónde estás o vives.", modelResponse: "Hi, I'm Marco. I'm new here, and I'm in apartment eight.", modelResponseEs: "Hola, soy Marco. Soy nuevo aquí y estoy en el departamento ocho."
      },
      {
        title: "To be en pasado", context: "Explicas por qué llegaste tarde a una cita.", objective: "Diferenciar was y were en una historia corta.", languageFocus: "I/he/she/it was · you/we/they were",
        dialogue: [line("A", "Receptionist", "Your appointment was at nine. Were you stuck in traffic?", "Tu cita era a las nueve. ¿Estabas atrapado en el tráfico?"), line("B", "Marco", "Yes. The roads were packed, and there was an accident.", "Sí. Las calles estaban llenas y hubo un accidente."), line("A", "Receptionist", "The doctor was delayed too, so you're fine.", "El doctor también estaba retrasado, así que no hay problema."), line("B", "Marco", "That's a relief. I was worried.", "Qué alivio. Estaba preocupado.")],
        question: "¿Por qué llegó tarde Marco?", options: ["La cita cambió", "Había tráfico y un accidente", "El doctor canceló"], answer: 1,
        chunks: [chunk("appointment was", "uh-POINT-ment-wuz", "la cita era"), chunk("roads were packed", "roads-wer-PACKT", "las calles estaban llenas"), chunk("I was worried", "eye-wuz-WOR-eed", "estaba preocupado")],
        responsePrompt: "Di que estabas en el trabajo y las calles estaban llenas.", modelResponse: "I was at work, and the roads were very busy.", modelResponseEs: "Estaba en el trabajo y las calles estaban muy transitadas."
      },
      {
        title: "Pasado regular", context: "Cuentas lo que hiciste ayer después del trabajo.", objective: "Reconocer y producir verbos regulares terminados en -ed.", languageFocus: "worked · called · ordered · watched",
        dialogue: [line("A", "Sam", "What did you do after work yesterday?", "¿Qué hiciste ayer después del trabajo?"), line("B", "Marco", "I called my brother, ordered dinner, and watched a movie.", "Llamé a mi hermano, pedí la cena y vi una película."), line("A", "Sam", "That sounds relaxing. Did you cook anything?", "Eso suena relajante. ¿Cocinaste algo?"), line("B", "Marco", "No, I worked late, so I ordered pizza.", "No, trabajé tarde, así que pedí pizza.")],
        question: "¿Por qué pidió pizza?", options: ["Trabajó tarde", "No tenía teléfono", "Visitó a su hermano"], answer: 0,
        chunks: [chunk("What did you do?", "whad-did-ja-DO", "¿Qué hiciste?"), chunk("called my brother", "CALLED-my-BRO-ther", "llamé a mi hermano"), chunk("worked late", "workt-LATE", "trabajé tarde")],
        responsePrompt: "Cuenta tres cosas que hiciste ayer usando verbos en pasado.", modelResponse: "Yesterday I worked, called a friend, and watched television.", modelResponseEs: "Ayer trabajé, llamé a un amigo y vi televisión."
      },
      {
        title: "Pasado irregular", context: "Hablas de una compra del fin de semana.", objective: "Usar went, bought, got y had en una secuencia real.", languageFocus: "go→went · buy→bought · get→got · have→had",
        dialogue: [line("A", "Lisa", "Did you find the shoes you wanted?", "¿Encontraste los zapatos que querías?"), line("B", "Marco", "Yes. I went downtown and bought a black pair.", "Sí. Fui al centro y compré un par negro."), line("A", "Lisa", "Did you get a good price?", "¿Conseguiste un buen precio?"), line("B", "Marco", "I did. They had a twenty-percent discount.", "Sí. Tenían veinte por ciento de descuento.")],
        question: "¿Qué compró Marco?", options: ["Una camisa azul", "Un par de zapatos negros", "Zapatos cafés sin descuento"], answer: 1,
        chunks: [chunk("Did you find", "did-ja-FIND", "¿Encontraste?"), chunk("went downtown", "went-DOWN-town", "fui al centro"), chunk("bought a black pair", "bawt-uh-BLACK-pair", "compré un par negro")],
        responsePrompt: "Di que fuiste a la tienda y compraste una camisa azul.", modelResponse: "I went to the store and bought a blue shirt.", modelResponseEs: "Fui a la tienda y compré una camisa azul."
      },
      {
        title: "Futuro con will", context: "Prometes resolver un problema de entrega.", objective: "Hacer decisiones y promesas inmediatas.", languageFocus: "I will / I'll · Will you…? · won't",
        dialogue: [line("A", "Customer", "My order still isn't here. Can you check it?", "Mi pedido todavía no llega. ¿Puedes revisarlo?"), line("B", "Marco", "Of course. I'll call the driver right now.", "Claro. Llamaré al conductor ahora mismo."), line("A", "Customer", "Will you let me know before five?", "¿Me avisarás antes de las cinco?"), line("B", "Marco", "Yes, I will. I won't leave until I have an answer.", "Sí. No me iré hasta tener una respuesta.")],
        question: "¿Qué hará Marco primero?", options: ["Cancelará la orden", "Llamará al conductor", "Esperará hasta mañana"], answer: 1,
        chunks: [chunk("I'll call", "ahl-CALL", "llamaré"), chunk("Will you let me know?", "will-ya-let-me-KNOW", "¿Me avisarás?"), chunk("I won't leave", "eye-WOANT-leave", "No me iré")],
        responsePrompt: "Promete llamar y enviar una actualización antes de las cuatro.", modelResponse: "I'll call now, and I'll send you an update before four.", modelResponseEs: "Llamaré ahora y te enviaré una actualización antes de las cuatro."
      },
      {
        title: "Planes con going to", context: "Hablas de tus planes para el fin de semana.", objective: "Diferenciar plan previo de decisión inmediata.", languageFocus: "am/is/are going to + verbo",
        dialogue: [line("A", "Rachel", "What are you going to do this weekend?", "¿Qué vas a hacer este fin de semana?"), line("B", "Marco", "I'm going to visit my sister on Saturday.", "Voy a visitar a mi hermana el sábado."), line("A", "Rachel", "Are you going to drive there?", "¿Vas a manejar hasta allá?"), line("B", "Marco", "No, we're going to take the train in the morning.", "No, vamos a tomar el tren por la mañana.")],
        question: "¿Cómo viajarán?", options: ["En automóvil", "En tren", "En avión"], answer: 1,
        chunks: [chunk("What are you going to", "whadder-ya-GON-na", "¿Qué vas a?"), chunk("I'm going to visit", "aim-GON-na-VIS-it", "Voy a visitar"), chunk("take the train", "take-thuh-TRAIN", "tomar el tren")],
        responsePrompt: "Di que vas a comprar zapatos mañana.", modelResponse: "I'm going to buy shoes tomorrow.", modelResponseEs: "Voy a comprar zapatos mañana."
      },
    ],
  },
  {
    title: "Vida real integrada",
    objective: "Combinar comida, compras, rutas, cuerpo, espacio y tiempos verbales en conversaciones menos predecibles.",
    missions: [
      {
        title: "La pizza llegó equivocada", context: "Recibiste un pedido distinto y llamas para corregirlo.", objective: "Explicar el pasado y acordar una solución futura.", languageFocus: "I ordered… · You sent… · We'll replace…",
        dialogue: [line("A", "Clerk", "Tony's Pizza. How can I help?", "Tony's Pizza. ¿Cómo puedo ayudar?"), line("B", "Marco", "I ordered pepperoni, but you sent a vegetable pizza.", "Pedí pepperoni, pero enviaron una pizza vegetariana."), line("A", "Clerk", "I'm sorry about that. We'll replace it right away.", "Lamento eso. La reemplazaremos de inmediato."), line("B", "Marco", "Thank you. Will the new pizza be here before eight?", "Gracias. ¿La nueva pizza llegará antes de las ocho?")],
        question: "¿Cuál fue el problema?", options: ["La pizza llegó fría", "Enviaron la pizza equivocada", "Faltó la bebida"], answer: 1,
        chunks: [chunk("I ordered", "eye-OR-derd", "Pedí"), chunk("you sent", "ya-SENT", "enviaron"), chunk("right away", "right-uh-WAY", "de inmediato")],
        responsePrompt: "Di que pediste queso y recibiste pepperoni.", modelResponse: "I ordered cheese, but I received pepperoni.", modelResponseEs: "Pedí queso, pero recibí pepperoni."
      },
      {
        title: "Zapatos para una entrevista", context: "Necesitas un modelo específico y comparas dos opciones.", objective: "Combinar color, talla, uso y futuro.", languageFocus: "These are… · Those were… · I'll take…",
        dialogue: [line("A", "Clerk", "These black shoes are formal, but those brown ones are more comfortable.", "Estos zapatos negros son formales, pero aquellos cafés son más cómodos."), line("B", "Marco", "I have an interview tomorrow, so I need something formal.", "Tengo una entrevista mañana, así que necesito algo formal."), line("A", "Clerk", "The black pair is available in your size.", "El par negro está disponible en tu talla."), line("B", "Marco", "Great. I'll take the black ones.", "Muy bien. Me llevaré los negros.")],
        question: "¿Cuáles comprará?", options: ["Los cafés", "Los negros", "Ninguno"], answer: 1,
        chunks: [chunk("those brown ones", "those-BROWN-wunz", "aquellos cafés"), chunk("in your size", "in-yer-SIZE", "en tu talla"), chunk("I'll take", "ahl-TAKE", "Me llevaré")],
        responsePrompt: "Elige los zapatos cafés porque son más cómodos.", modelResponse: "I'll take the brown ones because they're more comfortable.", modelResponseEs: "Me llevaré los cafés porque son más cómodos."
      },
      {
        title: "Entrega en un domicilio difícil", context: "Guías al repartidor desde la avenida hasta tu casa.", objective: "Dar una ruta y describir colores y referencias.", languageFocus: "turn at · drive past · between · across from",
        dialogue: [line("A", "Driver", "I'm on Lake Avenue, but I can't find number forty-two.", "Estoy en Lake Avenue, pero no encuentro el número 42."), line("B", "Marco", "Drive past the school and turn right at the blue store.", "Pasa la escuela y gira a la derecha en la tienda azul."), line("A", "Driver", "Is the house before the park?", "¿La casa está antes del parque?"), line("B", "Marco", "Yes. It's the white house between the pharmacy and the park.", "Sí. Es la casa blanca entre la farmacia y el parque.")],
        question: "¿Dónde está la casa?", options: ["Entre la farmacia y el parque", "Detrás de la escuela", "Junto a la tienda azul"], answer: 0,
        chunks: [chunk("drive past", "drive-PAST", "pasa de largo"), chunk("turn right at", "turn-RIGHT-at", "gira a la derecha en"), chunk("between the", "be-TWEEN-thuh", "entre")],
        responsePrompt: "Describe una casa roja frente al banco.", modelResponse: "It's the red house across from the bank.", modelResponseEs: "Es la casa roja frente al banco."
      },
      {
        title: "Explicar una lesión", context: "Hablas con una enfermera después de una caída.", objective: "Nombrar partes del cuerpo y contar qué pasó.", languageFocus: "I fell · I hurt my… · It is/was swollen",
        dialogue: [line("A", "Nurse", "What happened to your leg?", "¿Qué le pasó a tu pierna?"), line("B", "Marco", "I fell yesterday and hurt my left knee and ankle.", "Me caí ayer y me lastimé la rodilla y el tobillo izquierdos."), line("A", "Nurse", "Was your ankle swollen last night?", "¿Tu tobillo estaba hinchado anoche?"), line("B", "Marco", "Yes, it was. Today it feels a little better.", "Sí. Hoy se siente un poco mejor.")],
        question: "¿Qué partes se lastimó?", options: ["Brazo y hombro", "Rodilla y tobillo izquierdos", "Espalda y cuello"], answer: 1,
        chunks: [chunk("What happened to", "what-HAP-end-tuh", "¿Qué le pasó a?"), chunk("hurt my left knee", "hurt-my-left-NEE", "me lastimé la rodilla izquierda"), chunk("Was it swollen?", "wuz-it-SWO-len", "¿Estaba hinchado?")],
        responsePrompt: "Di que te caíste y te lastimaste la mano derecha.", modelResponse: "I fell and hurt my right hand.", modelResponseEs: "Me caí y me lastimé la mano derecha."
      },
      {
        title: "Encontrar todo en casa", context: "Alguien cuida tu casa y pregunta dónde están varias cosas.", objective: "Usar in, on, at, over y under con objetos reales.", languageFocus: "in the drawer · on the shelf · under / over · at home",
        dialogue: [line("A", "Rachel", "Where are the spare keys and the dog's food?", "¿Dónde están las llaves de repuesto y la comida del perro?"), line("B", "Marco", "The keys are in the top drawer, under the phone book.", "Las llaves están en el cajón superior, debajo de la guía telefónica."), line("A", "Rachel", "And the dog food?", "¿Y la comida del perro?"), line("B", "Marco", "It's on the shelf over the washing machine.", "Está en la repisa sobre la lavadora.")],
        question: "¿Dónde está la comida del perro?", options: ["En el cajón", "En la repisa sobre la lavadora", "Debajo del teléfono"], answer: 1,
        chunks: [chunk("spare keys", "spair-KEYZ", "llaves de repuesto"), chunk("top drawer", "top-DRAW-er", "cajón superior"), chunk("over the washing machine", "OH-ver-thuh-washing-machine", "sobre la lavadora")],
        responsePrompt: "Di que el medicamento está en la repisa, sobre el lavabo.", modelResponse: "The medicine is on the shelf over the sink.", modelResponseEs: "El medicamento está en la repisa sobre el lavabo."
      },
      {
        title: "Evaluación de vida real", context: "Resuelves tres necesidades dentro de una conversación natural.", objective: "Escuchar una situación nueva, ubicar información y responder en pasado y futuro.", languageFocus: "past + location + future response",
        dialogue: [line("A", "Lisa", "The driver called. He went to the old address and is now waiting by the red pharmacy.", "El conductor llamó. Fue al domicilio anterior y ahora espera junto a la farmacia roja."), line("B", "Marco", "That's two blocks from here. I'll call him and give him the new route.", "Eso está a dos cuadras de aquí. Lo llamaré y le daré la nueva ruta."), line("A", "Lisa", "Please tell him to turn left at the bank. Our building is behind it.", "Dile que gire a la izquierda en el banco. Nuestro edificio está detrás."), line("B", "Marco", "Got it. I'll guide him here now.", "Entendido. Lo guiaré hasta aquí ahora.")],
        question: "¿Dónde espera el conductor?", options: ["Detrás del banco", "Junto a la farmacia roja", "En el nuevo domicilio"], answer: 1,
        chunks: [chunk("went to the old address", "went-tuh-thee-old-ADDRESS", "fue al domicilio anterior"), chunk("two blocks from here", "two-BLOCKS-frum-here", "a dos cuadras de aquí"), chunk("I'll guide him", "ahl-GUIDE-im", "lo guiaré")],
        responsePrompt: "Resume dónde está el conductor y qué harás.", modelResponse: "He's by the red pharmacy. I'll call him and explain the route.", modelResponseEs: "Está junto a la farmacia roja. Lo llamaré y le explicaré la ruta."
      },
    ],
  },
];

export const TRAINING_WEEKS: TrainingWeek[] = RAW_WEEKS.map((week, weekIndex) => ({
  number: weekIndex + 1,
  title: week.title,
  objective: week.objective,
  missions: week.missions.map((mission, dayIndex) => ({
    ...mission,
    id: weekIndex * 6 + dayIndex + 1,
    week: weekIndex + 1,
    day: dayIndex + 1,
  })),
}));

export const ALL_MISSIONS = TRAINING_WEEKS.flatMap((week) => week.missions);

export const RESEARCH_LINKS = [
  {
    title: "Aprendizaje basado en tareas",
    note: "La comunicación con un resultado real favorece interacción, negociación de significado y retroalimentación.",
    href: "https://www.cambridge.org/core/books/cambridge-handbook-of-language-learning/taskbased-language-learning/015B20C55CF4D6A96E93D417059E3F41",
  },
  {
    title: "Práctica auditiva metacognitiva",
    note: "La secuencia escuchar–predecir–verificar–reflexionar puede superar la práctica tradicional de listening.",
    href: "https://www.frontiersin.org/journals/psychology/articles/10.3389/fpsyg.2023.1285059/full",
  },
  {
    title: "Entrenamiento auditivo y plasticidad adulta",
    note: "La práctica adaptativa, frecuente y exigente puede producir mejoras auditivas incluso en adultos mayores.",
    href: "https://pmc.ncbi.nlm.nih.gov/articles/PMC4254805/",
  },
  {
    title: "Input audiovisual en segunda lengua",
    note: "La evidencia sintetizada favorece material educativo con actividades, no exposición pasiva sin propósito.",
    href: "https://www.cambridge.org/core/journals/studies-in-second-language-acquisition/article/effects-of-audiovisual-input-on-second-language-learning-a-metaanalysis/9B61BAEF14F110F01148E398D171634A",
  },
] as const;
