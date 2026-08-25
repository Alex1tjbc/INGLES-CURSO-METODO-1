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
