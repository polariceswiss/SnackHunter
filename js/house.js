/* Snack Hunter Cafeteria — the house book.
   Prices, the five-mile cart, and the order ledger live here.
   Change the Google client id when the café connects its account. */
(function () {
  var HOUSE = {
    name: "Snack Hunter Cafeteria",
    lat: 25.7808,
    lng: -80.2586,
    address: "3799 NW 7th Street",
    city: "Miami, FL 33126",
    phone: "+17862905242",
    phonePretty: "786.290.5242",
    radiusMi: 3,
    cartMph: 12,
    prepMin: 18,
    googleClientId: "",
    pin: "3799"
  };

  var MENU = [
    { id: "cubano", group: "sandwiches", name: "El cubano", en: "Cuban", note: "Lechón, jamón, queso, mayonesa, mostaza y pepinillo.", cents: 1300, mark: "Firma", extra: true, shot: "assets/shots/cubano.jpg" },
    { id: "medianoche", group: "sandwiches", name: "Media noche", en: "Midnight", note: "El mismo armado, en pan de huevo.", cents: 1300, mark: "Firma", extra: true, shot: "assets/shots/medianoche.jpg" },
    { id: "bistec", group: "sandwiches", name: "Pan con bistec", en: "Steak sandwich", note: "Cebolla, lechuga, tomate, papitas, ketchup, mayonesa y mostaza.", cents: 1300, mark: "Firma", extra: true, shot: "assets/shots/bistec.jpg" },
    { id: "pollo", group: "sandwiches", name: "Sándwich de pollo", en: "Chicken sandwich", note: "El mismo armado del bistec, con pollo.", cents: 1300, extra: true, shot: "assets/shots/pollo.jpg" },
    { id: "jamon", group: "sandwiches", name: "Jamón y queso", en: "Ham and cheese", cents: 1300, extra: true, shot: "assets/shots/jamon.jpg" },
    { id: "tortilla-pan", group: "sandwiches", name: "Pan con tortilla", en: "Omelet sandwich", note: "Tortilla de huevo en pan. Sin lechuga ni tomate de fábrica.", cents: 1300, extra: true, shot: "assets/shots/tortilla-pan.jpg" },
    { id: "croqueta-prep", group: "sandwiches", name: "Croqueta preparada", en: "Croquette sandwich", cents: 1300, extra: true, shot: "assets/shots/croqueta-prep.jpg" },
    { id: "lechon", group: "sandwiches", name: "Pan con lechón", en: "Pork sandwich", cents: 1000, extra: true, shot: "assets/shots/lechon.jpg" },
    { id: "atun", group: "sandwiches", name: "Atún", en: "Tuna sandwich", note: "Mayonesa, cebolla, limón, lechuga, tomate, aceite, vinagre, sal y pimienta.", cents: 1000, extra: true, shot: "assets/shots/atun.jpg" },
    { id: "croqueta-fritas", group: "sandwiches", name: "Pan con croqueta y papas", en: "Croquette and fries", cents: 800, shot: "assets/shots/croqueta-fritas.jpg" },
    { id: "pan-tomate", group: "sandwiches", name: "Pan con tomate", en: "Tomato bread", cents: 600, shot: "assets/shots/pan-tomate.jpg" },
    { id: "frita", group: "sandwiches", name: "Frita", en: "Cuban burger", note: "Cebolla, ketchup, mayonesa, mostaza y papitas.", cents: 800, shot: "assets/shots/frita.jpg" },
    { id: "hotdog", group: "sandwiches", name: "Hot dog", en: "Hot dog", cents: 700, shot: "assets/shots/hotdog.jpg" },
    { id: "croissant", group: "sandwiches", name: "Croissant", en: "Croissant", cents: 700, shot: "assets/shots/croissant.jpg" },

    { id: "revueltos", group: "desayuno", name: "Huevos revueltos", en: "Scrambled eggs", cents: 800, shot: "assets/shots/revueltos.jpg" },
    { id: "tortilla", group: "desayuno", name: "Tortilla de huevo", en: "Omelet", cents: 800, shot: "assets/shots/tortilla.jpg" },
    { id: "fritos", group: "desayuno", name: "Huevos fritos", en: "Fried eggs", cents: 800, shot: "assets/shots/fritos.jpg" },
    { id: "tostada", group: "desayuno", name: "Tostada con mantequilla", en: "Toast with butter", cents: 200, shot: "assets/shots/tostada.jpg" },
    { id: "tostada-crema", group: "desayuno", name: "Tostada con queso crema", en: "Cream cheese toast", cents: 350, shot: "assets/shots/tostada-crema.jpg" },
    { id: "papas", group: "desayuno", name: "Papas fritas", en: "Fries", cents: 350, shot: "assets/shots/papas.jpg" },
    { id: "tocino", group: "desayuno", name: "Tocino", en: "Bacon", cents: 350, shot: "assets/shots/tocino.jpg" },
    { id: "sopa", group: "desayuno", name: "Sopa", en: "Soup", cents: 800, shot: "assets/shots/sopa.jpg" },

    { id: "cafecito", group: "calientes", name: "Cafecito", en: "Small coffee", note: "El pequeño.", cents: 100, shot: "assets/shots/cafecito.jpg" },
    { id: "media-colada", group: "calientes", name: "Media colada", en: "Half colada", cents: 200, shot: "assets/shots/colada.jpg" },
    { id: "colada", group: "calientes", name: "Colada", en: "Cuban espresso", note: "Corta, dulce, para pasar.", cents: 300, mark: "Casa", shot: "assets/shots/colada.jpg" },
    { id: "cortadito", group: "calientes", name: "Cortadito", en: "Cortadito", cents: 200, shot: "assets/shots/cortadito.jpg" },
    { id: "cortadito-ev", group: "calientes", name: "Cortadito con evaporada", en: "Cortadito, evaporated milk", cents: 300, shot: "assets/shots/cortadito.jpg" },
    { id: "conleche", group: "calientes", name: "Café con leche", en: "Café con leche", note: "Regular.", cents: 350, shot: "assets/shots/conleche.jpg" },
    { id: "conleche-ev", group: "calientes", name: "Café con leche con evaporada", en: "Café con leche, evaporated milk", note: "Regular.", cents: 500, shot: "assets/shots/conleche.jpg" },
    { id: "conleche-gr", group: "calientes", name: "Café con leche grande", en: "Large café con leche", cents: 700, shot: "assets/shots/conleche-gr.jpg" },
    { id: "conleche-gr-ev", group: "calientes", name: "Café con leche grande con evaporada", en: "Large, evaporated milk", cents: 900, shot: "assets/shots/conleche-gr.jpg" },
    { id: "cappuccino", group: "calientes", name: "Cappuccino", en: "Cappuccino", note: "Pequeño.", cents: 350, shot: "assets/shots/cappuccino.jpg" },
    { id: "cappuccino-gr", group: "calientes", name: "Cappuccino grande", en: "Large cappuccino", cents: 700, shot: "assets/shots/cappuccino.jpg" },
    { id: "chocolate", group: "calientes", name: "Chocolate caliente", en: "Hot chocolate", note: "Pequeño.", cents: 350, shot: "assets/shots/chocolate.jpg" },
    { id: "chocolate-gr", group: "calientes", name: "Chocolate grande", en: "Large hot chocolate", cents: 700, shot: "assets/shots/chocolate.jpg" },
    { id: "manzanilla", group: "calientes", name: "Té de manzanilla", en: "Chamomile tea", cents: 300, shot: "assets/shots/manzanilla.jpg" },
    { id: "te-verde", group: "calientes", name: "Té verde", en: "Green tea", cents: 300, shot: "assets/shots/te-verde.jpg" },

    { id: "pas-guayaba", group: "picar", name: "Pastelito de guayaba", en: "Guava pastry", cents: 150, shot: "assets/shots/pas-guayaba.jpg" },
    { id: "pas-queso", group: "picar", name: "Pastelito de queso", en: "Cheese pastry", cents: 150, shot: "assets/shots/pas-queso.jpg" },
    { id: "pas-mixto", group: "picar", name: "Pastelito de guayaba y queso", en: "Guava and cheese", cents: 150, shot: "assets/shots/pas-mixto.jpg" },
    { id: "pas-coco", group: "picar", name: "Pastelito de coco", en: "Coconut pastry", cents: 150, shot: "assets/shots/pas-coco.jpg" },
    { id: "teq-jq", group: "picar", name: "Tequeño de jamón y queso", en: "Ham and cheese finger", cents: 350, shot: "assets/shots/teq-jq.jpg" },
    { id: "teq-q", group: "picar", name: "Tequeño de queso", en: "Cheese finger", cents: 300, shot: "assets/shots/teq-q.jpg" },
    { id: "teq-g", group: "picar", name: "Tequeño de guayaba y queso", en: "Guava and cheese finger", cents: 300, shot: "assets/shots/teq-g.jpg" },
    { id: "croqueta", group: "picar", name: "Croqueta de jamón", en: "Ham croquette", note: "La unidad.", cents: 100, shot: "assets/shots/croqueta.jpg" },
    { id: "papa", group: "picar", name: "Papa rellena", en: "Stuffed potato", cents: 250, shot: "assets/shots/papa.jpg" },
    { id: "churros", group: "picar", name: "Churros", en: "Churros", note: "Cuatro unidades.", cents: 500, shot: "assets/shots/churros.jpg" },
    { id: "bono", group: "picar", name: "Pan de bono", en: "Pan de bono", cents: 250, shot: "assets/shots/bono.jpg" },

    { id: "emp-pollo", group: "empanadas", name: "Empanada de pollo", en: "Chicken patty", cents: 350, shot: "assets/shots/emp-pollo.jpg" },
    { id: "emp-carne", group: "empanadas", name: "Empanada de carne", en: "Beef patty", cents: 350, shot: "assets/shots/emp-carne.jpg" },
    { id: "emp-queso", group: "empanadas", name: "Empanada de queso", en: "Cheese patty", cents: 350, shot: "assets/shots/emp-queso.jpg" },
    { id: "emp-espinaca", group: "empanadas", name: "Empanada de espinaca", en: "Spinach patty", cents: 350, shot: "assets/shots/emp-espinaca.jpg" },

    { id: "ens-pollo", group: "ensaladas", name: "Ensalada de pollo", en: "Chicken salad", cents: 1300, shot: "assets/shots/ens-pollo.jpg" },
    { id: "ens-carne", group: "ensaladas", name: "Ensalada de carne", en: "Steak salad", cents: 1300, shot: "assets/shots/ens-carne.jpg" },
    { id: "ens-atun", group: "ensaladas", name: "Ensalada de atún", en: "Tuna salad", cents: 1300, shot: "assets/shots/ens-atun.jpg" },
    { id: "ens-veg", group: "ensaladas", name: "Ensalada de vegetales", en: "Vegetable salad", cents: 1300, shot: "assets/shots/ens-veg.jpg" },

    { id: "taco-pollo", group: "tacos", name: "Taco de pollo", en: "Chicken taco", cents: 700, shot: "assets/shots/taco-pollo.jpg" },
    { id: "taco-carne", group: "tacos", name: "Taco de carne", en: "Steak taco", cents: 700, shot: "assets/shots/taco-carne.jpg" },
    { id: "taco-puerco", group: "tacos", name: "Taco de puerco", en: "Pork taco", cents: 700, shot: "assets/shots/taco-puerco.jpg" },

    { id: "jugo-pina", group: "jugos", name: "Jugo de piña", en: "Pineapple", cents: 700, shot: "assets/shots/jugo-pina.jpg" },
    { id: "jugo-sandia", group: "jugos", name: "Jugo de melón de agua", en: "Watermelon", cents: 700, shot: "assets/shots/jugo-sandia.jpg" },
    { id: "jugo-maracuya", group: "jugos", name: "Jugo de maracuyá", en: "Passion fruit", cents: 700, shot: "assets/shots/jugo-maracuya.jpg" },
    { id: "jugo-mango", group: "jugos", name: "Jugo de mango", en: "Mango", cents: 700, shot: "assets/shots/jugo-mango.jpg" },
    { id: "jugo-naranja", group: "jugos", name: "Jugo de naranja", en: "Orange", cents: 700, shot: "assets/shots/jugo-naranja.jpg" },
    { id: "jugo-nz", group: "jugos", name: "Naranja y zanahoria", en: "Orange and carrot", cents: 700, shot: "assets/shots/jugo-nz.jpg" },

    { id: "bot-manzana", group: "bebidas", name: "Manzana", en: "Apple", cents: 250, shot: "assets/shots/bot-manzana.jpg" },
    { id: "bot-guayaba", group: "bebidas", name: "Guayaba", en: "Guava", cents: 250, shot: "assets/shots/bot-guayaba.jpg" },
    { id: "bot-cranberry", group: "bebidas", name: "Cranberry", en: "Cranberry", cents: 250, shot: "assets/shots/bot-cranberry.jpg" },
    { id: "coco", group: "bebidas", name: "Agua de coco", en: "Coconut water", cents: 250, shot: "assets/shots/coco.jpg" },
    { id: "malta-gr", group: "bebidas", name: "Malta grande", en: "Large malta", cents: 300, shot: "assets/shots/malta-gr.jpg" },
    { id: "malta-pe", group: "bebidas", name: "Malta pequeña", en: "Small malta", cents: 200, shot: "assets/shots/malta-pe.jpg" },
    { id: "agua", group: "bebidas", name: "Agua", en: "Water", cents: 200, shot: "assets/shots/agua.jpg" },
    { id: "soda", group: "bebidas", name: "Soda", en: "Soda", cents: 200, shot: "assets/shots/soda.jpg" },
    { id: "botella-gr", group: "bebidas", name: "Coke o Sprite grande", en: "Large bottle", cents: 300, label: "Coke · Sprite", shot: "assets/shots/botella-gr.jpg" },
    { id: "botella-pe", group: "bebidas", name: "Coke o Sprite pequeña", en: "Small bottle", cents: 200, label: "Coke · Sprite", shot: "assets/shots/botella-pe.jpg" },
    { id: "jarritos", group: "bebidas", name: "Jarritos", en: "Jarritos", cents: 300, label: "Jarritos", shot: "assets/shots/jarritos.jpg" },
    { id: "gatorade", group: "bebidas", name: "Gatorade", en: "Gatorade", cents: 300, label: "Gatorade", shot: "assets/shots/gatorade.jpg" },
    { id: "monster", group: "bebidas", name: "Monster", en: "Monster", cents: 300, label: "Monster", shot: "assets/shots/monster.jpg" },
    { id: "redbull", group: "bebidas", name: "Red Bull", en: "Red Bull", cents: 300, label: "Red Bull", shot: "assets/shots/redbull.jpg" },
    { id: "perrier", group: "bebidas", name: "Perrier", en: "Perrier", cents: 250, label: "Perrier", shot: "assets/shots/perrier.jpg" }
  ];

  var GROUPS = [
    { id: "sandwiches", name: "Sándwiches", en: "Sandwiches", fr: "Sandwichs", image: "assets/sec-sandwiches.jpg", alt: "Cubano prensado, abierto, con el queso cayendo.", altEn: "A pressed Cuban, open, with the cheese pulling.", altFr: "Cubain pressé, ouvert, le fromage qui file.", rule: "El armado está escrito en cada uno. El queso es suizo, americano o pepper jack. Un adicional de aguacate, tomate, queso o lechuga suma $2.50.", ruleEn: "The build is written on each one. Cheese is Swiss, American or pepper jack. Extra avocado, tomato, cheese or lettuce is $2.50.", ruleFr: "La composition est écrite sur chacun. Le fromage est suisse, américain ou pepper jack. Avocat, tomate, fromage ou laitue en plus : 2,50 $." },
    { id: "desayuno", name: "Desayuno", en: "Breakfast", fr: "Petit-déjeuner", image: "assets/sec-desayuno.jpg", alt: "Huevos, tostada y tocino en plato claro.", altEn: "Eggs, toast and bacon on a light plate.", altFr: "Œufs, toast et bacon sur une assiette claire." },
    { id: "calientes", name: "Calientes", en: "Hot drinks", fr: "Boissons chaudes", image: "assets/sec-calientes.jpg", alt: "Granos, moledora, saco de café y leche fresca.", altEn: "Beans, a grinder, a sack of coffee and fresh milk.", altFr: "Grains, moulin, sac de café et lait frais." },
    { id: "picar", name: "Para picar", en: "To start", fr: "Pour commencer", image: "assets/sec-picar.jpg", alt: "Pastelito de guayaba, croqueta y papa rellena.", altEn: "Guava pastry, a croquette and a stuffed potato.", altFr: "Pastelito à la goyave, croquette et pomme de terre farcie." },
    { id: "empanadas", name: "Empanadas", en: "Patties", fr: "Empanadas", image: "assets/sec-empanadas.jpg", alt: "Empanadas fritas, una abierta.", altEn: "Fried empanadas, one broken open.", altFr: "Empanadas frites, une ouverte." },
    { id: "ensaladas", name: "Ensaladas", en: "Salads", fr: "Salades", image: "assets/sec-ensaladas.jpg", alt: "Ensalada de carne con aguacate y tomate.", altEn: "Steak salad with avocado and tomato.", altFr: "Salade de viande, avocat et tomate.", rule: "Lechuga, tomate, cebolla, queso y aguacate.", ruleEn: "Lettuce, tomato, onion, cheese and avocado.", ruleFr: "Laitue, tomate, oignon, fromage et avocat." },
    { id: "tacos", name: "Tacos", en: "Tacos", fr: "Tacos", image: "assets/sec-tacos.jpg", alt: "Tres tacos americanos de pollo, carne y puerco, con lechuga y queso.", altEn: "Three American tacos: chicken, steak and pork, with lettuce and cheese.", altFr: "Trois tacos américains : poulet, viande et porc, laitue et fromage." },
    { id: "jugos", name: "Jugos", en: "Juices", fr: "Jus", image: "assets/sec-jugos.jpg", alt: "La licuadora sirviendo jugo de piña.", altEn: "The blender pouring pineapple juice.", altFr: "Le mixeur qui sert le jus d'ananas.", rule: "Los naturales salen a $7. Una fruta de más suma $3.", ruleEn: "The fresh ones are $7. An extra fruit is $3.", ruleFr: "Les jus frais sont à 7 $. Un fruit de plus : 3 $." },
    { id: "bebidas", name: "Bebidas", en: "Drinks", fr: "Boissons", image: "assets/sec-bebidas.jpg", alt: "Malta, cola, agua con gas y agua de coco.", altEn: "Malta, cola, sparkling water and coconut water.", altFr: "Malta, cola, eau pétillante et eau de coco." }
  ];

  var ABOUT = {
    cubano: ["Lechón, jamón, queso, mayonesa, mostaza y pepinillo. El queso es suizo, americano o pepper jack. Se prensa hasta que el pan cruje.", "Pulled pork, ham, cheese, mayo, mustard and pickles. Cheese is Swiss, American or pepper jack. Pressed."],
    medianoche: ["El mismo armado del cubano, en pan de huevo: lechón, jamón, queso, mayonesa, mostaza y pepinillo. También pasa por la prensa.", "The Cuban build on egg bread: pulled pork, ham, cheese, mayo, mustard and pickles. Pressed."],
    bistec: ["Bistec de la casa con cebolla, lechuga, tomate, papitas, ketchup, mayonesa y mostaza. Se le puede sumar jamón, queso, tocino, aguacate o croqueta.", "House steak with onion, lettuce, tomato, potato sticks, ketchup, mayo and mustard. Ham, cheese, bacon, avocado or a croquette can be added."],
    pollo: ["El mismo armado del bistec, con pollo: cebolla, lechuga, tomate, papitas, ketchup, mayonesa y mostaza. También se le suma jamón, queso, tocino, aguacate o croqueta.", "The steak build, with chicken: onion, lettuce, tomato, potato sticks, ketchup, mayo and mustard. Ham, cheese, bacon, avocado or a croquette can be added."],
    jamon: ["Jamón y queso en pan. También lleva lechuga, tomate, vinagre, sal, cebolla y pimienta.", "Ham and cheese on bread, with the house toppings."],
    "tortilla-pan": ["Tortilla de huevo dentro del pan. Solo el huevo; no lleva lechuga ni tomate de fábrica. Si los quiere, van de extra (+$2.50).", "Egg omelet in bread — egg only. No lettuce or tomato unless added as a paid extra (+$2.50)."],
    "croqueta-prep": ["Croquetas de jamón dentro del pan, armadas como sándwich. Lechuga, tomate, vinagre, sal, cebolla y pimienta.", "Ham croquettes on bread, dressed like a sandwich."],
    lechon: ["Lechón asado en pan. Llega con lechuga, tomate, vinagre, sal, cebolla y pimienta.", "Roast pork on bread, with the house toppings."],
    atun: ["Atún con mayonesa, cebolla, limón, lechuga, tomate, aceite de oliva, vinagre, sal y pimienta.", "Tuna with mayo, onion, lime, lettuce, tomato, olive oil, vinegar, salt and pepper."],
    "croqueta-fritas": ["Pan con una croqueta de jamón y papas fritas. Es el combo corto de la casa.", "Bread with a ham croquette and fries."],
    "pan-tomate": ["Pan con tomate. Sin el armado largo del sándwich.", "Bread and tomato."],
    frita: ["La hamburguesa de la casa, con cebolla, ketchup, mayonesa, mostaza y papitas.", "The house burger, with onion, ketchup, mayo, mustard and potato sticks."],
    hotdog: ["Salchicha en pan.", "A sausage in a bun."],
    croissant: ["El croissant de la casa, solo.", "The house croissant."],
    revueltos: ["Huevos revueltos en la plancha. Es el desayuno de la casa.", "Eggs scrambled on the griddle."],
    tortilla: ["Tortilla de huevo, doblada en la plancha.", "A folded omelet."],
    fritos: ["Huevos fritos, con la yema a la vista.", "Fried eggs."],
    tostada: ["Pan tostado con mantequilla.", "Toast with butter."],
    "tostada-crema": ["Pan tostado con queso crema.", "Toast with cream cheese."],
    papas: ["Papas fritas, aparte. También se piden de extra con el desayuno.", "A side of fries."],
    tocino: ["Tocino, para sumar al desayuno.", "Bacon, on the side."],
    sopa: ["La sopa de la casa. El sabor se confirma en el mostrador.", "The house soup. Ask the counter what is on today."],
    cafecito: ["Un café cubano pequeño, corto y dulce.", "A small, sweet Cuban coffee."],
    "media-colada": ["La mitad de una colada. El mismo café dulce, en menos.", "Half a colada. The same sweet coffee, smaller."],
    colada: ["Café cubano dulce, para compartir. Se toma corto.", "Sweet Cuban coffee, meant to share."],
    cortadito: ["Espresso cortado con un golpe de leche.", "Espresso cut with a splash of milk."],
    "cortadito-ev": ["El mismo cortadito, hecho con leche evaporada.", "The same cortadito, with evaporated milk."],
    conleche: ["Café cubano con leche, tamaño regular.", "Cuban coffee with milk, regular size."],
    "conleche-ev": ["El café con leche regular, con leche evaporada.", "Regular café con leche, made with evaporated milk."],
    "conleche-gr": ["Café con leche en vaso grande.", "Café con leche in a large glass."],
    "conleche-gr-ev": ["El café con leche grande, con leche evaporada.", "Large café con leche, with evaporated milk."],
    cappuccino: ["Cappuccino pequeño, con espuma.", "A small cappuccino, with foam."],
    "cappuccino-gr": ["El mismo cappuccino, en grande.", "The same cappuccino, large."],
    chocolate: ["Chocolate caliente, tamaño pequeño.", "Hot chocolate, small."],
    "chocolate-gr": ["Chocolate caliente grande.", "Hot chocolate, large."],
    manzanilla: ["Infusión de manzanilla.", "Chamomile tea."],
    "te-verde": ["Té verde, caliente.", "Hot green tea."],
    "pas-guayaba": ["Hojaldre horneado, relleno de guayaba.", "Baked pastry filled with guava."],
    "pas-queso": ["Hojaldre horneado, relleno de queso.", "Baked pastry filled with cheese."],
    "pas-mixto": ["Hojaldre horneado, con guayaba y queso juntos.", "Baked pastry with guava and cheese."],
    "pas-coco": ["Hojaldre horneado, relleno de coco.", "Baked pastry filled with coconut."],
    "teq-jq": ["Masa frita con jamón y queso adentro. El queso se estira al partirlo.", "Fried dough with ham and cheese. The cheese pulls."],
    "teq-q": ["Tequeño frito, solo de queso.", "A fried cheese finger."],
    "teq-g": ["Tequeño frito de guayaba y queso.", "A fried finger of guava and cheese."],
    croqueta: ["Una croqueta de jamón, frita. Se pide por unidad.", "One fried ham croquette."],
    papa: ["Papa rellena, frita. El relleno es el de la casa.", "A fried stuffed potato, with the house filling."],
    churros: ["Cuatro churros fritos, en una sola orden.", "Four fried churros, one order."],
    bono: ["Pan de bono, el panecillo de queso.", "Cheese bread."],
    "emp-pollo": ["Empanada frita, rellena de pollo.", "A fried patty filled with chicken."],
    "emp-carne": ["Empanada frita, rellena de carne.", "A fried patty filled with beef."],
    "emp-queso": ["Empanada frita, rellena de queso.", "A fried patty filled with cheese."],
    "emp-espinaca": ["Empanada frita, rellena de espinaca.", "A fried patty filled with spinach."],
    "ens-pollo": ["Lechuga, tomate, cebolla, queso y aguacate, con pollo de la casa.", "Lettuce, tomato, onion, cheese and avocado, with chicken."],
    "ens-carne": ["La misma base, con carne de la casa.", "The same base, with steak."],
    "ens-atun": ["La misma base, con atún.", "The same base, with tuna."],
    "ens-veg": ["Lechuga, tomate, cebolla, queso y aguacate. Sin carne.", "Lettuce, tomato, onion, cheese and avocado. No meat."],
    "taco-pollo": ["Tortilla con pollo de la casa.", "A tortilla with house chicken."],
    "taco-carne": ["Tortilla con carne de la casa.", "A tortilla with steak."],
    "taco-puerco": ["Tortilla con puerco de la casa.", "A tortilla with pork."],
    "jugo-pina": ["Piña licuada al momento. Una fruta de más suma $3.", "Pineapple, blended to order. Extra fruit is $3."],
    "jugo-sandia": ["Melón de agua licuado al momento. Una fruta de más suma $3.", "Watermelon, blended to order. Extra fruit is $3."],
    "jugo-maracuya": ["Maracuyá licuado al momento. Una fruta de más suma $3.", "Passion fruit, blended to order. Extra fruit is $3."],
    "jugo-mango": ["Mango licuado al momento. Una fruta de más suma $3.", "Mango, blended to order. Extra fruit is $3."],
    "jugo-naranja": ["Naranja licuada al momento. Una fruta de más suma $3.", "Orange, blended to order. Extra fruit is $3."],
    "jugo-nz": ["Naranja y zanahoria, licuadas juntas. Una fruta de más suma $3.", "Orange and carrot, blended together. Extra fruit is $3."],
    "bot-manzana": ["Jugo de manzana, de botella.", "Bottled apple juice."],
    "bot-guayaba": ["Jugo de guayaba, de botella.", "Bottled guava juice."],
    "bot-cranberry": ["Jugo de cranberry, de botella.", "Bottled cranberry juice."],
    coco: ["Agua de coco, fría.", "Cold coconut water."],
    "malta-gr": ["Malta, botella grande.", "Malta, large bottle."],
    "malta-pe": ["Malta, botella pequeña.", "Malta, small bottle."],
    agua: ["Agua, fría.", "Cold water."],
    soda: ["Soda, fría.", "A cold soda."],
    "botella-gr": ["Botella grande de Coke o Sprite.", "A large bottle of Coke or Sprite."],
    "botella-pe": ["Botella pequeña de Coke o Sprite.", "A small bottle of Coke or Sprite."],
    jarritos: ["Jarritos, frío.", "A cold Jarritos."],
    gatorade: ["Gatorade, frío.", "A cold Gatorade."],
    monster: ["Monster, frío.", "A cold Monster."],
    redbull: ["Red Bull, frío.", "A cold Red Bull."],
    perrier: ["Perrier, con gas.", "Sparkling Perrier."]
  };

  var EXTRAS = {
    queso: { id: "queso", name: "Queso", en: "Cheese", fr: "Fromage", cents: 250 },
    aguacate: { id: "aguacate", name: "Aguacate", en: "Avocado", fr: "Avocat", cents: 250 },
    tomate: { id: "tomate", name: "Tomate", en: "Tomato", fr: "Tomate", cents: 250 },
    lechuga: { id: "lechuga", name: "Lechuga", en: "Lettuce", fr: "Laitue", cents: 250 }
  };

  /* Default build parts — guest can turn off (skip) in the cart. From house ABOUT only. */
  var PARTS = {
    lechon: { name: "Lechón", en: "Pork", fr: "Porc" },
    jamon: { name: "Jamón", en: "Ham", fr: "Jambon" },
    queso: { name: "Queso", en: "Cheese", fr: "Fromage" },
    mayonesa: { name: "Mayonesa", en: "Mayo", fr: "Mayo" },
    mostaza: { name: "Mostaza", en: "Mustard", fr: "Moutarde" },
    pepinillo: { name: "Pepinillo", en: "Pickle", fr: "Cornichon" },
    cebolla: { name: "Cebolla", en: "Onion", fr: "Oignon" },
    lechuga: { name: "Lechuga", en: "Lettuce", fr: "Laitue" },
    tomate: { name: "Tomate", en: "Tomato", fr: "Tomate" },
    papitas: { name: "Papitas", en: "Potato sticks", fr: "Paillassons" },
    ketchup: { name: "Ketchup", en: "Ketchup", fr: "Ketchup" },
    vinagre: { name: "Vinagre", en: "Vinegar", fr: "Vinaigre" },
    sal: { name: "Sal", en: "Salt", fr: "Sel" },
    pimienta: { name: "Pimienta", en: "Pepper", fr: "Poivre" },
    limon: { name: "Limón", en: "Lime", fr: "Citron vert" },
    aceite: { name: "Aceite", en: "Oil", fr: "Huile" },
    mantequilla: { name: "Mantequilla", en: "Butter", fr: "Beurre" },
    "queso-crema": { name: "Queso crema", en: "Cream cheese", fr: "Cream cheese" },
    aguacate: { name: "Aguacate", en: "Avocado", fr: "Avocat" },
    pollo: { name: "Pollo", en: "Chicken", fr: "Poulet" },
    carne: { name: "Carne", en: "Steak", fr: "Viande" },
    atun: { name: "Atún", en: "Tuna", fr: "Thon" },
    croqueta: { name: "Croqueta", en: "Croquette", fr: "Croquette" },
    papas: { name: "Papas", en: "Fries", fr: "Frites" },
    pan: { name: "Pan", en: "Bread", fr: "Pain" },
    salchicha: { name: "Salchicha", en: "Sausage", fr: "Saucisse" },
    huevo: { name: "Huevo", en: "Egg", fr: "Œuf" },
    leche: { name: "Leche", en: "Milk", fr: "Lait" },
    evaporada: { name: "Evaporada", en: "Evaporated milk", fr: "Lait évaporé" },
    espuma: { name: "Espuma", en: "Foam", fr: "Mousse" },
    guayaba: { name: "Guayaba", en: "Guava", fr: "Goyave" },
    coco: { name: "Coco", en: "Coconut", fr: "Coco" },
    espinaca: { name: "Espinaca", en: "Spinach", fr: "Épinard" },
    tortilla: { name: "Tortilla", en: "Tortilla", fr: "Tortilla" },
    puerco: { name: "Puerco", en: "Pork", fr: "Porc" }
  };

  var BUILDS = {
    cubano: ["lechon", "jamon", "queso", "mayonesa", "mostaza", "pepinillo"],
    medianoche: ["lechon", "jamon", "queso", "mayonesa", "mostaza", "pepinillo"],
    bistec: ["cebolla", "lechuga", "tomate", "papitas", "ketchup", "mayonesa", "mostaza"],
    pollo: ["cebolla", "lechuga", "tomate", "papitas", "ketchup", "mayonesa", "mostaza"],
    jamon: ["jamon", "queso", "lechuga", "tomate", "vinagre", "sal", "cebolla", "pimienta"],
    "tortilla-pan": ["huevo"],
    "croqueta-prep": ["croqueta", "lechuga", "tomate", "vinagre", "sal", "cebolla", "pimienta"],
    lechon: ["lechon", "lechuga", "tomate", "vinagre", "sal", "cebolla", "pimienta"],
    atun: ["atun", "mayonesa", "cebolla", "limon", "lechuga", "tomate", "aceite", "vinagre", "sal", "pimienta"],
    "croqueta-fritas": ["pan", "croqueta", "papas"],
    "pan-tomate": ["pan", "tomate"],
    frita: ["cebolla", "ketchup", "mayonesa", "mostaza", "papitas"],
    hotdog: ["salchicha", "pan"],
    croissant: ["pan"],
    revueltos: ["huevo"],
    tortilla: ["huevo"],
    fritos: ["huevo"],
    tostada: ["pan", "mantequilla"],
    "tostada-crema": ["pan", "queso-crema"],
    papas: ["papas"],
    tocino: ["tocino"],
    cafecito: ["cafe"],
    "media-colada": ["cafe"],
    colada: ["cafe"],
    cortadito: ["cafe", "leche"],
    "cortadito-ev": ["cafe", "evaporada"],
    conleche: ["cafe", "leche"],
    "conleche-ev": ["cafe", "evaporada"],
    "conleche-gr": ["cafe", "leche"],
    "conleche-gr-ev": ["cafe", "evaporada"],
    cappuccino: ["cafe", "espuma"],
    "cappuccino-gr": ["cafe", "espuma"],
    chocolate: ["chocolate"],
    "chocolate-gr": ["chocolate"],
    manzanilla: ["te"],
    "te-verde": ["te"],
    "pas-guayaba": ["guayaba"],
    "pas-queso": ["queso"],
    "pas-mixto": ["guayaba", "queso"],
    "pas-coco": ["coco"],
    "teq-jq": ["jamon", "queso"],
    "teq-q": ["queso"],
    "teq-g": ["guayaba", "queso"],
    croqueta: ["croqueta"],
    papa: ["papa"],
    churros: ["churros"],
    bono: ["queso"],
    "emp-pollo": ["pollo"],
    "emp-carne": ["carne"],
    "emp-queso": ["queso"],
    "emp-espinaca": ["espinaca"],
    "ens-pollo": ["lechuga", "tomate", "cebolla", "queso", "aguacate", "pollo"],
    "ens-carne": ["lechuga", "tomate", "cebolla", "queso", "aguacate", "carne"],
    "ens-atun": ["lechuga", "tomate", "cebolla", "queso", "aguacate", "atun"],
    "ens-veg": ["lechuga", "tomate", "cebolla", "queso", "aguacate"],
    "taco-pollo": ["tortilla", "pollo", "lechuga", "queso"],
    "taco-carne": ["tortilla", "carne", "lechuga", "queso"],
    "taco-puerco": ["tortilla", "puerco", "lechuga", "queso"]
  };

  // Extra PARTS used only in builds above
  PARTS.tocino = { name: "Tocino", en: "Bacon", fr: "Bacon" };
  PARTS.cafe = { name: "Café", en: "Coffee", fr: "Café" };
  PARTS.te = { name: "Té", en: "Tea", fr: "Thé" };
  PARTS.chocolate = { name: "Chocolate", en: "Chocolate", fr: "Chocolat" };
  PARTS.papa = { name: "Papa rellena", en: "Stuffed potato", fr: "Pomme farcie" };
  PARTS.churros = { name: "Churros", en: "Churros", fr: "Churros" };

  function buildOf(id) {
    return BUILDS[id] || [];
  }

  function partLabel(key, lang) {
    var part = PARTS[key];
    if (!part) return key;
    if (lang === "en") return part.en;
    if (lang === "fr") return part.fr;
    return part.name;
  }

  function skipNote(line) {
    var skip = line.skip || {};
    return buildOf(line.id).filter(function (key) { return !!skip[key]; }).map(function (key) {
      return "sin " + (PARTS[key] ? PARTS[key].name.toLowerCase() : key);
    });
  }

  var FR_NAME = {
    cubano: "Le cubain",
    medianoche: "Medianoche",
    bistec: "Sandwich au steak",
    pollo: "Sandwich au poulet",
    jamon: "Jambon-fromage",
    "tortilla-pan": "Sandwich à l'omelette",
    "croqueta-prep": "Sandwich aux croquettes",
    lechon: "Sandwich au porc",
    atun: "Thon",
    "croqueta-fritas": "Croquette et frites",
    "pan-tomate": "Pain à la tomate",
    frita: "Frita",
    hotdog: "Hot-dog",
    croissant: "Croissant",
    revueltos: "Œufs brouillés",
    tortilla: "Omelette",
    fritos: "Œufs au plat",
    tostada: "Toast au beurre",
    "tostada-crema": "Toast au fromage frais",
    papas: "Frites",
    tocino: "Bacon",
    sopa: "Soupe",
    cafecito: "Cafecito",
    "media-colada": "Demie colada",
    colada: "Colada",
    cortadito: "Cortadito",
    "cortadito-ev": "Cortadito, lait évaporé",
    conleche: "Café con leche",
    "conleche-ev": "Café con leche, lait évaporé",
    "conleche-gr": "Café con leche, grand",
    "conleche-gr-ev": "Grand, lait évaporé",
    cappuccino: "Cappuccino",
    "cappuccino-gr": "Grand cappuccino",
    chocolate: "Chocolat chaud",
    "chocolate-gr": "Grand chocolat chaud",
    manzanilla: "Tisane de camomille",
    "te-verde": "Thé vert",
    "pas-guayaba": "Pastelito à la goyave",
    "pas-queso": "Pastelito au fromage",
    "pas-mixto": "Pastelito goyave et fromage",
    "pas-coco": "Pastelito à la noix de coco",
    "teq-jq": "Tequeño jambon-fromage",
    "teq-q": "Tequeño au fromage",
    "teq-g": "Tequeño goyave et fromage",
    croqueta: "Croquette au jambon",
    papa: "Pomme de terre farcie",
    churros: "Churros",
    bono: "Pan de bono",
    "emp-pollo": "Empanada au poulet",
    "emp-carne": "Empanada à la viande",
    "emp-queso": "Empanada au fromage",
    "emp-espinaca": "Empanada aux épinards",
    "ens-pollo": "Salade au poulet",
    "ens-carne": "Salade de viande",
    "ens-atun": "Salade de thon",
    "ens-veg": "Salade de légumes",
    "taco-pollo": "Taco au poulet",
    "taco-carne": "Taco à la viande",
    "taco-puerco": "Taco au porc",
    "jugo-pina": "Jus d'ananas",
    "jugo-sandia": "Jus de pastèque",
    "jugo-maracuya": "Jus de fruit de la passion",
    "jugo-mango": "Jus de mangue",
    "jugo-naranja": "Jus d'orange",
    "jugo-nz": "Orange et carotte",
    "bot-manzana": "Pomme",
    "bot-guayaba": "Goyave",
    "bot-cranberry": "Canneberge",
    coco: "Eau de coco",
    "malta-gr": "Malta, grande",
    "malta-pe": "Malta, petite",
    agua: "Eau",
    soda: "Soda",
    "botella-gr": "Grande bouteille",
    "botella-pe": "Petite bouteille",
    jarritos: "Jarritos",
    gatorade: "Gatorade",
    monster: "Monster",
    redbull: "Red Bull",
    perrier: "Perrier"
  };

  var FR_ABOUT = {
    cubano: "Porc rôti, jambon, fromage, mayonnaise, moutarde et cornichon. Le fromage est suisse, américain ou pepper jack. Pressé jusqu'à ce que le pain croustille.",
    medianoche: "Le même cubain, dans un pain brioché : porc rôti, jambon, fromage, mayonnaise, moutarde et cornichon. Il passe aussi à la presse.",
    bistec: "Steak de la maison avec oignon, laitue, tomate, frites, ketchup, mayonnaise et moutarde. On peut ajouter jambon, fromage, bacon, avocat ou une croquette.",
    pollo: "Le même assemblage que le steak, au poulet : oignon, laitue, tomate, frites, ketchup, mayonnaise et moutarde. Jambon, fromage, bacon, avocat ou croquette en plus.",
    jamon: "Jambon et fromage dans le pain, avec laitue, tomate, vinaigre, sel, oignon et poivre.",
    "tortilla-pan": "Omelette dans le pain — seulement l'œuf. Pas de laitue ni de tomate sauf en extra (+2,50 $).",
    "croqueta-prep": "Croquettes au jambon dans le pain, habillées comme un sandwich.",
    lechon: "Porc rôti dans le pain, avec laitue, tomate, vinaigre, sel, oignon et poivre.",
    atun: "Thon, mayonnaise, oignon, citron vert, laitue, tomate, huile d'olive, vinaigre, sel et poivre.",
    "croqueta-fritas": "Pain, une croquette au jambon et des frites. Le petit combo de la maison.",
    "pan-tomate": "Pain et tomate. Sans le long assemblage du sandwich.",
    frita: "Le burger de la maison, avec oignon, ketchup, mayonnaise, moutarde et frites.",
    hotdog: "Une saucisse dans un pain.",
    croissant: "Le croissant de la maison, seul.",
    revueltos: "Œufs brouillés sur la plancha. Le petit-déjeuner de la maison.",
    tortilla: "Omelette pliée sur la plancha.",
    fritos: "Œufs au plat, le jaune à vue.",
    tostada: "Pain grillé au beurre.",
    "tostada-crema": "Pain grillé au fromage frais.",
    papas: "Des frites, à part. On les ajoute aussi au petit-déjeuner.",
    tocino: "Du bacon, pour accompagner le petit-déjeuner.",
    sopa: "La soupe de la maison. Le goût du jour se confirme au comptoir.",
    cafecito: "Un petit café cubain, court et sucré.",
    "media-colada": "La moitié d'une colada. Le même café sucré, en moins.",
    colada: "Café cubain sucré, à partager. On le boit court.",
    cortadito: "Un espresso coupé d'un nuage de lait.",
    "cortadito-ev": "Le même cortadito, au lait évaporé.",
    conleche: "Café cubain au lait, taille régulière.",
    "conleche-ev": "Le café au lait régulier, au lait évaporé.",
    "conleche-gr": "Café au lait dans un grand verre.",
    "conleche-gr-ev": "Le grand café au lait, au lait évaporé.",
    cappuccino: "Un petit cappuccino, avec de la mousse.",
    "cappuccino-gr": "Le même cappuccino, en grand.",
    chocolate: "Chocolat chaud, petit.",
    "chocolate-gr": "Chocolat chaud, grand.",
    manzanilla: "Infusion de camomille.",
    "te-verde": "Thé vert, chaud.",
    "pas-guayaba": "Feuilleté cuit, fourré à la goyave.",
    "pas-queso": "Feuilleté cuit, fourré au fromage.",
    "pas-mixto": "Feuilleté cuit, goyave et fromage ensemble.",
    "pas-coco": "Feuilleté cuit, fourré à la noix de coco.",
    "teq-jq": "Pâte frite, jambon et fromage dedans. Le fromage file quand on le coupe.",
    "teq-q": "Tequeño frit, seulement au fromage.",
    "teq-g": "Tequeño frit, goyave et fromage.",
    croqueta: "Une croquette au jambon, frite. À la pièce.",
    papa: "Pomme de terre farcie, frite. La farce est celle de la maison.",
    churros: "Quatre churros frits, une seule commande.",
    bono: "Pan de bono, le petit pain au fromage.",
    "emp-pollo": "Empanada frite, fourrée au poulet.",
    "emp-carne": "Empanada frite, fourrée à la viande.",
    "emp-queso": "Empanada frite, fourrée au fromage.",
    "emp-espinaca": "Empanada frite, fourrée aux épinards.",
    "ens-pollo": "Laitue, tomate, oignon, fromage et avocat, avec le poulet de la maison.",
    "ens-carne": "La même base, avec la viande de la maison.",
    "ens-atun": "La même base, au thon.",
    "ens-veg": "Laitue, tomate, oignon, fromage et avocat. Sans viande.",
    "taco-pollo": "Tortilla et poulet de la maison.",
    "taco-carne": "Tortilla et viande de la maison.",
    "taco-puerco": "Tortilla et porc de la maison.",
    "jugo-pina": "Ananas mixé à la commande. Un fruit de plus : 3 $.",
    "jugo-sandia": "Pastèque mixée à la commande. Un fruit de plus : 3 $.",
    "jugo-maracuya": "Fruit de la passion mixé à la commande. Un fruit de plus : 3 $.",
    "jugo-mango": "Mangue mixée à la commande. Un fruit de plus : 3 $.",
    "jugo-naranja": "Orange mixée à la commande. Un fruit de plus : 3 $.",
    "jugo-nz": "Orange et carotte, mixées ensemble. Un fruit de plus : 3 $.",
    "bot-manzana": "Jus de pomme, en bouteille.",
    "bot-guayaba": "Jus de goyave, en bouteille.",
    "bot-cranberry": "Jus de canneberge, en bouteille.",
    coco: "Eau de coco, froide.",
    "malta-gr": "Malta, grande bouteille.",
    "malta-pe": "Malta, petite bouteille.",
    agua: "Eau, froide.",
    soda: "Soda, froid.",
    "botella-gr": "Grande bouteille de Coke ou de Sprite.",
    "botella-pe": "Petite bouteille de Coke ou de Sprite.",
    jarritos: "Jarritos, froid.",
    gatorade: "Gatorade, froid.",
    monster: "Monster, froid.",
    redbull: "Red Bull, froid.",
    perrier: "Perrier, pétillant."
  };

  function read(key, fallback) {
    try {
      var raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (e) {
      return fallback;
    }
  }

  function write(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  function settings() {
    var saved = read("sh.settings", {});
    return {
      delivery: saved.delivery !== false,
      fee: typeof saved.fee === "number" ? saved.fee : 250,
      tax: typeof saved.tax === "number" ? saved.tax : 0.07,
      pin: saved.pin || HOUSE.pin,
      zelle: saved.zelle || ""
    };
  }

  function saveSettings(next) {
    write("sh.settings", next);
  }

  function menu() {
    var over = read("sh.prices", {});
    return MENU.map(function (item) {
      var copy = Object.assign({}, item);
      if (typeof over[item.id] === "number") copy.cents = over[item.id];
      if (FR_NAME[item.id]) copy.fr = FR_NAME[item.id];
      if (ABOUT[item.id]) {
        copy.about = ABOUT[item.id][0];
        copy.aboutEn = ABOUT[item.id][1];
        copy.aboutFr = FR_ABOUT[item.id] || ABOUT[item.id][1];
      }
      return copy;
    });
  }

  function itemById(id) {
    return menu().filter(function (item) { return item.id === id; })[0] || null;
  }

  function money(cents) {
    var n = (cents / 100).toFixed(2);
    return "$" + n.replace(/\.00$/, "");
  }

  function milesBetween(aLat, aLng, bLat, bLng) {
    var R = 3958.7613;
    var p1 = aLat * Math.PI / 180;
    var p2 = bLat * Math.PI / 180;
    var dp = (bLat - aLat) * Math.PI / 180;
    var dl = (bLng - aLng) * Math.PI / 180;
    var h = Math.sin(dp / 2) * Math.sin(dp / 2) + Math.cos(p1) * Math.cos(p2) * Math.sin(dl / 2) * Math.sin(dl / 2);
    return 2 * R * Math.asin(Math.min(1, Math.sqrt(h)));
  }

  function eta(miles) {
    var ride = Math.round((miles / HOUSE.cartMph) * 60);
    return HOUSE.prepMin + ride;
  }

  function extraOn(line) {
    return Object.keys(EXTRAS).some(function (key) { return !!line[key]; });
  }

  function lineCents(line) {
    var item = itemById(line.id);
    if (!item) return 0;
    var build = buildOf(line.id);
    var extra = 0;
    Object.keys(EXTRAS).forEach(function (key) {
      if (line[key] && build.indexOf(key) < 0) extra += EXTRAS[key].cents;
    });
    return (item.cents + extra) * line.qty;
  }

  function blankLine(id) {
    var row = { id: id, qty: 1, wish: "", skip: {} };
    Object.keys(EXTRAS).forEach(function (key) { row[key] = false; });
    return row;
  }

  function explode(lines) {
    var out = [];
    (lines || []).forEach(function (line) {
      var n = Math.max(1, Number(line.qty) || 1);
      var i;
      for (i = 0; i < n; i++) {
        var row = blankLine(line.id);
        row.wish = line.wish || "";
        row.skip = Object.assign({}, line.skip || {});
        Object.keys(EXTRAS).forEach(function (key) { row[key] = !!line[key]; });
        out.push(row);
      }
    });
    return out;
  }

  function cart() {
    return explode(read("sh.cart", []));
  }

  function saveCart(lines) {
    write("sh.cart", lines);
    document.dispatchEvent(new CustomEvent("sh:cart"));
  }

  function addLine(id, after) {
    var lines = cart();
    var row = blankLine(id);
    if (typeof after === "number" && after >= 0 && after < lines.length) lines.splice(after + 1, 0, row);
    else lines.push(row);
    saveCart(lines);
  }

  function parseKeyList(raw) {
    if (!raw) return [];
    if (Array.isArray(raw)) return raw;
    if (typeof raw === "string") {
      try {
        var parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) return parsed;
      } catch (err) {}
      return String(raw).split(/[,|]/).map(function (s) { return s.trim(); }).filter(Boolean);
    }
    return [];
  }

  /** Paid extras the guest can still add — never charge for parts already in the default build. */
  function paidExtrasFor(id) {
    var build = buildOf(id);
    return Object.keys(EXTRAS).filter(function (key) {
      return build.indexOf(key) < 0;
    });
  }

  function applyPaidExtra(row, key, flash) {
    var k = String(key || "").trim().toLowerCase();
    if (!EXTRAS[k]) return;
    if (buildOf(row.id).indexOf(k) >= 0) {
      flash.push("included:" + k);
      return;
    }
    var item = itemById(row.id);
    if (item && item.extra === false) return;
    if (item && !item.extra) return;
    row[k] = true;
    flash.push("extra:" + k);
  }

  function applySpokenMods(row, raw) {
    var flash = [];
    var wish = raw.wish ? String(raw.wish).slice(0, 120) : "";
    if (wish) row.wish = wish;
    parseKeyList(raw.skip || raw.remove || raw.sin).forEach(function (key) {
      var k = String(key || "").trim().toLowerCase();
      if (!k) return;
      if (PARTS[k] || buildOf(row.id).indexOf(k) >= 0) {
        row.skip[k] = true;
        flash.push("skip:" + k);
      }
    });
    Object.keys(EXTRAS).forEach(function (key) {
      if (raw[key] === true || raw[key] === "true" || raw[key] === 1) {
        applyPaidExtra(row, key, flash);
      }
    });
    parseKeyList(raw.extras).forEach(function (key) {
      applyPaidExtra(row, key, flash);
    });
    return flash;
  }

  /**
   * Stage menu lines from voice — never pays.
   * If the same item id is already in the cart, UPDATE that line instead of
   * duplicating (reciting/confirming the order must not add again).
   * Pass another/force_new true only when the guest wants a second separate line.
   */
  function stageItems(list) {
    var lines = cart();
    var added = 0;
    var updated = 0;
    var flash = [];
    var lastId = null;
    (list || []).forEach(function (raw) {
      var id = raw && (raw.id || raw.item_id || raw.sku);
      if (!id || !itemById(id)) return;
      lastId = id;
      var forceNew = !!(raw && (raw.another === true || raw.another === "true" || raw.force_new === true || raw.force_new === "true"));
      var index = -1;
      var i;
      if (!forceNew) {
        for (i = lines.length - 1; i >= 0; i--) {
          if (lines[i].id === id) { index = i; break; }
        }
      }
      if (index >= 0) {
        var nextQty = Number(raw.qty);
        if (isFinite(nextQty) && nextQty >= 1) {
          lines[index].qty = Math.max(1, Math.min(20, nextQty));
        }
        flash = flash.concat(applySpokenMods(lines[index], raw || {}));
        updated += 1;
        return;
      }
      var qty = Math.max(1, Math.min(20, Number(raw.qty) || 1));
      for (i = 0; i < qty; i++) {
        var row = blankLine(id);
        flash = flash.concat(applySpokenMods(row, raw || {}));
        lines.push(row);
        added += 1;
      }
    });
    if (added || updated) {
      saveCart(lines);
      if (lastId) goToSection(lastId, { expand: true });
    }
    return { added: added, updated: updated, flash: flash };
  }

  var SECTION_ALIASES = {
    sandwich: "sandwiches",
    sandwiches: "sandwiches",
    sandwicheria: "sandwiches",
    cubano: "sandwiches",
    cubanos: "sandwiches",
    desayuno: "desayuno",
    desayunos: "desayuno",
    breakfast: "desayuno",
    calientes: "calientes",
    cafe: "calientes",
    coffee: "calientes",
    "hot drinks": "calientes",
    "hot-drinks": "calientes",
    picar: "picar",
    snacks: "picar",
    starters: "picar",
    "para picar": "picar",
    empanadas: "empanadas",
    patties: "picar",
    ensaladas: "ensaladas",
    salads: "ensaladas",
    salad: "ensaladas",
    tacos: "tacos",
    taco: "tacos",
    jugos: "jugos",
    jugo: "jugos",
    juices: "jugos",
    juice: "jugos",
    bebidas: "bebidas",
    bebida: "bebidas",
    drinks: "bebidas",
    drink: "bebidas",
    sodas: "bebidas",
    carta: "carta",
    menu: "carta",
    menú: "carta"
  };

  function resolveSection(raw) {
    var key = String(raw || "").trim().toLowerCase();
    if (!key) return null;
    if (SECTION_ALIASES[key]) return SECTION_ALIASES[key];
    if (GROUPS.some(function (g) { return g.id === key; })) return key;
    var item = itemById(key) || findItemFuzzy(key);
    if (item && item.group) return item.group;
    var hit = null;
    GROUPS.some(function (g) {
      if (
        g.name.toLowerCase() === key ||
        (g.en && g.en.toLowerCase() === key) ||
        (g.fr && g.fr.toLowerCase() === key)
      ) {
        hit = g;
        return true;
      }
      return false;
    });
    return hit ? hit.id : null;
  }

  function findItemFuzzy(raw) {
    var key = String(raw || "").trim().toLowerCase()
      .replace(/á/g, "a").replace(/é/g, "e").replace(/í/g, "i")
      .replace(/ó/g, "o").replace(/ú/g, "u").replace(/ñ/g, "n");
    if (!key) return null;
    var exact = itemById(key);
    if (exact) return exact;
    var found = null;
    MENU.some(function (item) {
      var names = [item.id, item.name, item.en, item.label].filter(Boolean).map(function (s) {
        return String(s).toLowerCase()
          .replace(/á/g, "a").replace(/é/g, "e").replace(/í/g, "i")
          .replace(/ó/g, "o").replace(/ú/g, "u").replace(/ñ/g, "n");
      });
      if (names.indexOf(key) >= 0 || names.some(function (n) { return n.indexOf(key) >= 0 || key.indexOf(n) >= 0; })) {
        found = item;
        return true;
      }
      return false;
    });
    return found;
  }

  /** Scroll the page to a menu section or item, and expand that dish. Never pays. */
  function goToSection(raw, opts) {
    var options = opts || {};
    var key = String(raw || "").trim().toLowerCase();
    var maybeItem = itemById(key) || findItemFuzzy(key);
    var section = resolveSection(raw);
    if (!section && !maybeItem) return { ok: false, error: "unknown_section", section: null };
    if (!section && maybeItem) section = maybeItem.group;
    var itemId = maybeItem ? maybeItem.id : (options.itemId || null);
    document.dispatchEvent(new CustomEvent("sh:go-section", {
      detail: {
        section: section,
        itemId: itemId,
        expand: options.expand !== false
      }
    }));
    return { ok: true, section: section, itemId: itemId, expanded: options.expand !== false };
  }

  /**
   * Write what the guest is saying into the open cart:
   * update last matching line, or add one. Never pays.
   */
  function syncSpoken(raw) {
    var id = raw && (raw.id || raw.item_id || raw.sku);
    if (!id || !itemById(id)) return { ok: false, error: "unknown_id", flash: [] };
    var lines = cart();
    var index = -1;
    var i;
    for (i = lines.length - 1; i >= 0; i--) {
      if (lines[i].id === id) { index = i; break; }
    }
    var flash = [];
    if (index < 0) {
      var row = blankLine(id);
      flash = applySpokenMods(row, raw || {});
      lines.push(row);
      index = lines.length - 1;
    } else {
      if (!lines[index].skip) lines[index].skip = {};
      flash = applySpokenMods(lines[index], raw || {});
    }
    saveCart(lines);
    goToSection(id, { expand: true });
    document.dispatchEvent(new CustomEvent("sh:cart-flash", { detail: { index: index, flash: flash } }));
    return { ok: true, index: index, flash: flash, cart_count: lines.length };
  }

  function updateLine(index, patch, quiet) {
    var lines = cart();
    if (!lines[index]) return;
    Object.keys(patch).forEach(function (key) { lines[index][key] = patch[key]; });
    if (lines[index].qty < 1) lines.splice(index, 1);
    write("sh.cart", lines);
    if (!quiet) document.dispatchEvent(new CustomEvent("sh:cart"));
  }

  function clearCart() {
    saveCart([]);
  }

  function totals(service) {
    var cfg = settings();
    var sub = cart().reduce(function (sum, line) { return sum + lineCents(line); }, 0);
    var fee = service === "carrito" ? cfg.fee : 0;
    var tax = Math.round((sub + fee) * cfg.tax);
    return { sub: sub, fee: fee, tax: tax, total: sub + fee + tax };
  }

  function profile() {
    return read("sh.profile", null);
  }

  function saveProfile(next) {
    write("sh.profile", next);
    document.dispatchEvent(new CustomEvent("sh:profile"));
  }

  function localOrders() {
    return read("sh.orders", []);
  }

  function rememberOrder(order) {
    var all = localOrders();
    var idx = -1;
    all.forEach(function (row, i) { if (row.id === order.id) idx = i; });
    if (idx >= 0) all[idx] = order;
    else all.unshift(order);
    write("sh.orders", all.slice(0, 200));
    var mine = read("sh.mine", []);
    if (mine.indexOf(order.id) < 0) {
      mine.unshift(order.id);
      write("sh.mine", mine.slice(0, 12));
    }
  }

  function staffPin() {
    try {
      return sessionStorage.getItem("sh.cajaPin") || settings().pin;
    } catch (e) {
      return settings().pin;
    }
  }

  function postOrder(order) {
    if (!order.token) order.token = Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2);
    rememberOrder(order);
    return fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(order)
    }).then(function (res) {
      if (!res.ok) throw new Error("no");
      return res.json();
    }).then(function (saved) {
      rememberOrder(saved);
      return saved;
    }).catch(function () {
      return order;
    });
  }

  function loadOrders() {
    return fetch("/api/orders", {
      headers: { "X-House-Pin": String(staffPin()) }
    }).then(function (res) {
      if (!res.ok) throw new Error("no");
      return res.json();
    }).then(function (rows) {
      if (Array.isArray(rows)) write("sh.orders", rows);
      return localOrders();
    }).catch(function () {
      return localOrders();
    });
  }

  function refreshMine() {
    var ids = read("sh.mine", []);
    var local = localOrders();
    return Promise.all(ids.map(function (id) {
      var row = null;
      local.forEach(function (order) { if (order.id === id) row = order; });
      if (!row || !row.token) return Promise.resolve(row);
      return fetch("/api/orders/" + encodeURIComponent(id) + "?token=" + encodeURIComponent(row.token)).then(function (res) {
        if (!res.ok) throw new Error("no");
        return res.json();
      }).then(function (fresh) {
        rememberOrder(fresh);
        return fresh;
      }).catch(function () { return row; });
    }));
  }

  function patchOrder(id, patch) {
    var all = localOrders().map(function (order) {
      if (order.id !== id) return order;
      return Object.assign({}, order, patch);
    });
    write("sh.orders", all);
    return fetch("/api/orders/" + encodeURIComponent(id), {
      method: "PATCH",
      headers: { "Content-Type": "application/json", "X-House-Pin": String(staffPin()) },
      body: JSON.stringify(patch)
    }).catch(function () { return null; });
  }

  function newId() {
    var n = Math.floor(1000 + Math.random() * 9000);
    return "SH-" + n;
  }

  function pullBook() {
    return fetch("/api/book").then(function (res) {
      if (!res.ok) throw new Error("no");
      return res.json();
    }).then(function (book) {
      if (book && book.prices && Object.keys(book.prices).length) write("sh.prices", book.prices);
      if (book && book.settings && Object.keys(book.settings).length) {
        write("sh.settings", Object.assign({}, read("sh.settings", {}), book.settings));
      }
    }).catch(function () {});
  }

  function pushBook() {
    return fetch("/api/book", {
      method: "PUT",
      headers: { "Content-Type": "application/json", "X-House-Pin": String(staffPin()) },
      body: JSON.stringify({ prices: read("sh.prices", {}), settings: settings() })
    }).then(function (res) {
      if (res && res.ok) {
        try { sessionStorage.setItem("sh.cajaPin", String(settings().pin)); } catch (e) {}
      }
      return res;
    }).catch(function () {});
  }

  window.SH = {
    HOUSE: HOUSE,
    GROUPS: GROUPS,
    EXTRAS: EXTRAS,
    PARTS: PARTS,
    BUILDS: BUILDS,
    buildOf: buildOf,
    paidExtrasFor: paidExtrasFor,
    partLabel: partLabel,
    skipNote: skipNote,
    settings: settings,
    saveSettings: saveSettings,
    menu: menu,
    itemById: itemById,
    money: money,
    milesBetween: milesBetween,
    eta: eta,
    lineCents: lineCents,
    cart: cart,
    addLine: addLine,
    stageItems: stageItems,
    syncSpoken: syncSpoken,
    goToSection: goToSection,
    resolveSection: resolveSection,
    updateLine: updateLine,
    clearCart: clearCart,
    totals: totals,
    profile: profile,
    saveProfile: saveProfile,
    localOrders: localOrders,
    postOrder: postOrder,
    loadOrders: loadOrders,
    refreshMine: refreshMine,
    patchOrder: patchOrder,
    newId: newId,
    pullBook: pullBook,
    pushBook: pushBook
  };
})();
