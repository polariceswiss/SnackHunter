/* Snack Hunter Café — the house book.
   Prices, the five-mile cart, and the order ledger live here.
   Change the Google client id when the café connects its account. */
(function () {
  var HOUSE = {
    name: "Snack Hunter Café",
    lat: 25.7808,
    lng: -80.2586,
    address: "3799 NW 7th Street",
    city: "Miami, FL 33126",
    phone: "+17862905242",
    phonePretty: "786.290.5242",
    radiusMi: 5,
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
    { id: "tortilla-pan", group: "sandwiches", name: "Pan con tortilla", en: "Omelet sandwich", cents: 1300, extra: true, shot: "assets/shots/tortilla-pan.jpg" },
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
    { id: "botella-gr", group: "bebidas", name: "Coke o Sprite grande", en: "Large bottle", cents: 300, shot: "assets/shots/botella-gr.jpg" },
    { id: "botella-pe", group: "bebidas", name: "Coke o Sprite pequeña", en: "Small bottle", cents: 200, shot: "assets/shots/botella-pe.jpg" },
    { id: "jarritos", group: "bebidas", name: "Jarritos", en: "Jarritos", cents: 300, shot: "assets/shots/jarritos.jpg" },
    { id: "gatorade", group: "bebidas", name: "Gatorade", en: "Gatorade", cents: 300, shot: "assets/shots/gatorade.jpg" },
    { id: "monster", group: "bebidas", name: "Monster", en: "Monster", cents: 300, shot: "assets/shots/monster.jpg" },
    { id: "redbull", group: "bebidas", name: "Red Bull", en: "Red Bull", cents: 300, shot: "assets/shots/redbull.jpg" },
    { id: "perrier", group: "bebidas", name: "Perrier", en: "Perrier", cents: 250, shot: "assets/shots/perrier.jpg" }
  ];

  var GROUPS = [
    { id: "sandwiches", name: "Sándwiches", en: "Sandwiches", image: "assets/sec-sandwiches.jpg", alt: "Cubano prensado, abierto, con el queso cayendo.", altEn: "A pressed Cuban, open, with the cheese pulling.", rule: "El armado está escrito en cada uno. El queso es suizo, americano o pepper jack. Un adicional de aguacate, tomate, queso o lechuga suma $2.50.", ruleEn: "The build is written on each one. Cheese is Swiss, American or pepper jack. Extra avocado, tomato, cheese or lettuce is $2.50." },
    { id: "desayuno", name: "Desayuno", en: "Breakfast", image: "assets/sec-desayuno.jpg", alt: "Huevos, tostada y tocino en plato claro.", altEn: "Eggs, toast and bacon on a light plate." },
    { id: "calientes", name: "Calientes", en: "Hot drinks", image: "assets/sec-calientes.jpg", alt: "Granos, moledora, saco de café y leche fresca.", altEn: "Beans, a grinder, a sack of coffee and fresh milk." },
    { id: "picar", name: "Para picar", en: "To start", image: "assets/sec-picar.jpg", alt: "Pastelito de guayaba, croqueta y papa rellena.", altEn: "Guava pastry, a croquette and a stuffed potato." },
    { id: "empanadas", name: "Empanadas", en: "Patties", image: "assets/sec-empanadas.jpg", alt: "Empanadas fritas, una abierta.", altEn: "Fried empanadas, one broken open." },
    { id: "ensaladas", name: "Ensaladas", en: "Salads", image: "assets/sec-ensaladas.jpg", alt: "Ensalada de carne con aguacate y tomate.", altEn: "Steak salad with avocado and tomato.", rule: "Lechuga, tomate, cebolla, queso y aguacate.", ruleEn: "Lettuce, tomato, onion, cheese and avocado." },
    { id: "tacos", name: "Tacos", en: "Tacos", image: "assets/sec-tacos.jpg", alt: "Tres tacos americanos de pollo, carne y puerco, con lechuga y queso.", altEn: "Three American tacos: chicken, steak and pork, with lettuce and cheese." },
    { id: "jugos", name: "Jugos", en: "Juices", image: "assets/sec-jugos.jpg", alt: "La licuadora sirviendo jugo de piña.", altEn: "The blender pouring pineapple juice.", rule: "Los naturales salen a $7. Una fruta de más suma $3.", ruleEn: "The fresh ones are $7. An extra fruit is $3." },
    { id: "bebidas", name: "Bebidas", en: "Drinks", image: "assets/sec-bebidas.jpg", alt: "Malta, cola, agua con gas y agua de coco.", altEn: "Malta, cola, sparkling water and coconut water." }
  ];

  var ABOUT = {
    cubano: ["Lechón, jamón, queso, mayonesa, mostaza y pepinillo. El queso es suizo, americano o pepper jack. Se prensa hasta que el pan cruje.", "Pulled pork, ham, cheese, mayo, mustard and pickles. Cheese is Swiss, American or pepper jack. Pressed."],
    medianoche: ["El mismo armado del cubano, en pan de huevo: lechón, jamón, queso, mayonesa, mostaza y pepinillo. También pasa por la prensa.", "The Cuban build on egg bread: pulled pork, ham, cheese, mayo, mustard and pickles. Pressed."],
    bistec: ["Bistec de la casa con cebolla, lechuga, tomate, papitas, ketchup, mayonesa y mostaza. Se le puede sumar jamón, queso, tocino, aguacate o croqueta.", "House steak with onion, lettuce, tomato, potato sticks, ketchup, mayo and mustard. Ham, cheese, bacon, avocado or a croquette can be added."],
    pollo: ["El mismo armado del bistec, con pollo: cebolla, lechuga, tomate, papitas, ketchup, mayonesa y mostaza. También se le suma jamón, queso, tocino, aguacate o croqueta.", "The steak build, with chicken: onion, lettuce, tomato, potato sticks, ketchup, mayo and mustard. Ham, cheese, bacon, avocado or a croquette can be added."],
    jamon: ["Jamón y queso en pan. También lleva lechuga, tomate, vinagre, sal, cebolla y pimienta.", "Ham and cheese on bread, with the house toppings."],
    "tortilla-pan": ["Tortilla de huevo dentro del pan, armada como sándwich: lechuga, tomate, vinagre, sal, cebolla y pimienta.", "An omelet on bread, finished like the other sandwiches."],
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
    queso: { id: "queso", name: "Queso", en: "Cheese", cents: 250 },
    aguacate: { id: "aguacate", name: "Aguacate", en: "Avocado", cents: 250 },
    tomate: { id: "tomate", name: "Tomate", en: "Tomato", cents: 250 },
    lechuga: { id: "lechuga", name: "Lechuga", en: "Lettuce", cents: 250 }
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
      if (ABOUT[item.id]) {
        copy.about = ABOUT[item.id][0];
        copy.aboutEn = ABOUT[item.id][1];
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
    var extra = 0;
    Object.keys(EXTRAS).forEach(function (key) {
      if (line[key]) extra += EXTRAS[key].cents;
    });
    return (item.cents + extra) * line.qty;
  }

  function blankLine(id) {
    var row = { id: id, qty: 1, wish: "" };
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
