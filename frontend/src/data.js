import { dinerService } from "./api/dinerService";

export const INITIAL_RESTAURANTS = [
  {
    id: "bombay-darling",
    name: "Bombay Darling",
    rating: 4.6,
    reviewsCount: 1240,
    cuisines: ["North Indian", "Biryani", "Chinese"],
    deliveryTime: "25-30 mins",
    deliveryFee: 35,
    image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&q=80&w=800",
    discount: "30% OFF",
    isPromoBadge: true,
    address: "Sheikh Zayed Rd, Downtown Dubai",
    coordinates: { x: 35, y: 45 },
    menu: [
      {
        id: "bd-1",
        name: "Special Chicken Biryani",
        price: 39,
        description: "Fragrant long-grain basmati rice cooked with succulent chicken, spices, saffron, and mint.",
        image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&q=80&w=400",
        isVeg: false,
        isBestseller: true,
        category: "Biryani"
      },
      {
        id: "bd-2",
        name: "Butter Chicken with Butter Naan",
        price: 45,
        description: "Tender tandoori chicken cooked in a rich, creamy, and velvety tomato-butter gravy, served with 1 Naan.",
        image: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&q=80&w=400",
        isVeg: false,
        isBestseller: true,
        category: "Indian"
      },
      {
        id: "bd-3",
        name: "Paneer Butter Masala",
        price: 35,
        description: "Fresh cottage cheese cubes simmered in our signature tomato cream gravy.",
        image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&q=80&w=400",
        isVeg: true,
        isBestseller: false,
        category: "Indian"
      },
      {
        id: "bd-4",
        name: "Schezwan Fried Rice",
        price: 28,
        description: "Spicy and tangy fried rice tossed with vegetables, garlic, and fiery Schezwan sauce.",
        image: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&q=80&w=400",
        isVeg: true,
        isBestseller: false,
        category: "Chinese"
      },
      {
        id: "bd-5",
        name: "Dal Makhani",
        price: 29,
        description: "Classic black lentils slow-cooked overnight with tomatoes, cream, and butter.",
        image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&q=80&w=400",
        isVeg: true,
        isBestseller: true,
        category: "Indian"
      },
      {
        id: "bd-6",
        name: "Garlic Naan",
        price: 8,
        description: "Fresh hot garlic flatbread baked in traditional clay tandoor.",
        image: "https://images.unsplash.com/photo-1601050690597-df056fb4ce78?auto=format&fit=crop&q=80&w=400",
        isVeg: true,
        category: "Indian"
      },
      {
        id: "bd-7",
        name: "Tandoori Roti",
        price: 4,
        description: "Healthy whole wheat flatbread baked in the tandoor.",
        image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&q=80&w=400",
        isVeg: true,
        category: "Indian"
      },
      {
        id: "bd-8",
        name: "Veg Samosa (2 pcs)",
        price: 12,
        description: "Crispy pastry filled with spiced potato and pea mixture, served with mint chutney.",
        image: "https://images.unsplash.com/photo-1601050690597-df056fb4ce78?auto=format&fit=crop&q=80&w=400",
        isVeg: true,
        category: "Indian"
      },
      {
        id: "bd-9",
        name: "Mango Lassi",
        price: 15,
        description: "Creamy yoghurt shake flavored with sweet Alphonso mangoes.",
        image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&q=80&w=400",
        isVeg: true,
        category: "Indian"
      },
      {
        id: "bd-10",
        name: "Chicken Tikka Masala",
        price: 38,
        description: "Spiced boneless chicken cooked in a rich onion-tomato masala gravy.",
        image: "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?auto=format&fit=crop&q=80&w=400",
        isVeg: false,
        category: "Indian"
      },
      {
        id: "bd-11",
        name: "Gulab Jamun (2 pcs)",
        price: 14,
        description: "Golden milk-solid balls soaked in hot aromatic cardamom-sugar syrup.",
        image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&q=80&w=400",
        isVeg: true,
        category: "Desserts"
      }
    ]
  },
  {
    id: "tikka-masala",
    name: "Tikka Masala",
    rating: 4.5,
    reviewsCount: 890,
    cuisines: ["Indian", "Mughlai", "Kebabs"],
    deliveryTime: "20-25 mins",
    deliveryFee: 25,
    image: "https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?auto=format&fit=crop&q=80&w=800",
    discount: "40% OFF",
    isPromoBadge: true,
    address: "Marina Walk, Dubai Marina",
    coordinates: { x: 50, y: 30 },
    menu: [
      {
        id: "tm-1",
        name: "Tandoori Chicken Platter",
        price: 59,
        description: "An assortment of mint-infused tandoori tikka, malai kebab, and classic drumsticks, grilled to perfection.",
        image: "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?auto=format&fit=crop&q=80&w=400",
        isVeg: false,
        isBestseller: true,
        category: "Kebabs"
      },
      {
        id: "tm-2",
        name: "Butter Chicken Pizza",
        price: 38,
        description: "New Launch! Thin crust pizza topped with spicy butter chicken chunks, red onions, fresh coriander, and premium mozzarella.",
        image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=400",
        isVeg: false,
        isBestseller: true,
        category: "Indian"
      },
      {
        id: "tm-3",
        name: "Mutton Seekh Kebab",
        price: 42,
        description: "Finely minced mutton mixed with aromatic spices, skewered and tandoor-roasted.",
        image: "https://images.unsplash.com/photo-1608500218900-15f13d8d748f?auto=format&fit=crop&q=80&w=400",
        isVeg: false,
        category: "Kebabs"
      },
      {
        id: "tm-4",
        name: "Mughlai Chicken Korma",
        price: 49,
        description: "Rich, aromatic royal gravy cooked with almonds, cashews, and a touch of saffron.",
        image: "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&q=80&w=400",
        isVeg: false,
        category: "Indian"
      },
      {
        id: "tm-5",
        name: "Paneer Tikka",
        price: 34,
        description: "Marinated cottage cheese cubes grilled with onions and bell peppers.",
        image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&q=80&w=400",
        isVeg: true,
        category: "Indian"
      },
      {
        id: "tm-6",
        name: "Garlic Butter Naan",
        price: 6,
        description: "Soft naan bread glazed with garlic and pure salted butter.",
        image: "https://images.unsplash.com/photo-1601050690597-df056fb4ce78?auto=format&fit=crop&q=80&w=400",
        isVeg: true,
        category: "Indian"
      },
      {
        id: "tm-7",
        name: "Basmati Pulav Rice",
        price: 15,
        description: "Fragrant long-grain basmati rice cooked with whole spices.",
        image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&q=80&w=400",
        isVeg: true,
        category: "Indian"
      },
      {
        id: "tm-8",
        name: "Chicken Malai Tikka",
        price: 39,
        description: "Mild creamy chicken skewers marinated in cheese, yogurt, and green cardamom.",
        image: "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?auto=format&fit=crop&q=80&w=400",
        isVeg: false,
        category: "Kebabs"
      },
      {
        id: "tm-9",
        name: "Veg Biryani",
        price: 32,
        description: "Slow-cooked basmati rice layered with mixed winter vegetables and rose water.",
        image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&q=80&w=400",
        isVeg: true,
        category: "Biryani"
      },
      {
        id: "tm-10",
        name: "Garlic Hummus",
        price: 18,
        description: "Creamy garlic-infused chickpea paste topped with extra virgin olive oil.",
        image: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=400",
        isVeg: true,
        category: "Arabian"
      },
      {
        id: "tm-11",
        name: "Gajar ka Halwa",
        price: 16,
        description: "Traditional warm carrot pudding cooked with sweetened milk and pistachios.",
        image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&q=80&w=400",
        isVeg: true,
        category: "Desserts"
      }
    ]
  },
  {
    id: "yalla-manila",
    name: "Yalla Manila",
    rating: 4.4,
    reviewsCount: 650,
    cuisines: ["Arabic", "Shawarma", "Lebanese"],
    deliveryTime: "25-30 mins",
    deliveryFee: 40,
    image: "https://plus.unsplash.com/premium_photo-1676409608965-665e89ba22a4?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    discount: "25% OFF",
    isPromoBadge: true,
    address: "Al Barsha 1, Near Mall of the Emirates",
    coordinates: { x: 20, y: 65 },
    menu: [
      {
        id: "ym-1",
        name: "Premium Shawarma Bowl",
        price: 29,
        description: "Buy 1 Get 1 Free! Slow-roasted chicken shawarma over loaded garlic yellow rice, served with hummus, pickles, and toum.",
        image: "https://images.unsplash.com/photo-1607532941433-304659e8198a?auto=format&fit=crop&q=80&w=400",
        isVeg: false,
        isBestseller: true,
        category: "Arabian"
      },
      {
        id: "ym-2",
        name: "Hummus with Seared Lamb",
        price: 32,
        description: "Creamy artisan hummus topped with warm, spiced minced lamb and olive oil. Served with fresh pita.",
        image: "https://images.unsplash.com/photo-1574894709920-11b28e7367e3?auto=format&fit=crop&q=80&w=400",
        isVeg: false,
        category: "Arabian"
      },
      {
        id: "ym-3",
        name: "Crispy Falafel Wrap",
        price: 18,
        description: "Golden-fried spiced chickpea croquettes wrapped in thin Lebanese bread with tahini and fresh greens.",
        image: "https://images.unsplash.com/photo-1530469912745-a215c6b256ea?auto=format&fit=crop&q=80&w=400",
        isVeg: true,
        isBestseller: true,
        category: "Arabian"
      },
      {
        id: "ym-4",
        name: "Garlic Toum Dip",
        price: 6,
        description: "Rich and fluffy emulsion of garlic, vegetable oil, and fresh lemon juice.",
        image: "https://images.unsplash.com/photo-1541518763669-27fef04b14ea?auto=format&fit=crop&q=80&w=400",
        isVeg: true,
        category: "Arabian"
      },
      {
        id: "ym-5",
        name: "Classic Arabic Rice",
        price: 14,
        description: "Fragrant golden yellow rice cooked with Arabic spices and dry lemon.",
        image: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=400",
        isVeg: true,
        category: "Arabian"
      },
      {
        id: "ym-6",
        name: "Beef Shawarma Roll",
        price: 22,
        description: "Thinly sliced spit-roasted marinated beef rolled in pita with tahini.",
        image: "https://images.unsplash.com/photo-1621510456681-2330135e5871?auto=format&fit=crop&q=80&w=400",
        isVeg: false,
        category: "Arabian"
      },
      {
        id: "ym-7",
        name: "Tabbouleh Salad",
        price: 16,
        description: "Finely chopped parsley, mint, tomatoes, and bulgur with olive oil and lemon dressing.",
        image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=400",
        isVeg: true,
        category: "Arabian"
      },
      {
        id: "ym-8",
        name: "Fattoush Salad",
        price: 17,
        description: "Crisp mixed greens, cucumber, radish, and fried pita bread tossed in sumac-lemon vinaigrette.",
        image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=400",
        isVeg: true,
        category: "Arabian"
      },
      {
        id: "ym-9",
        name: "Mixed Charcoal Grill Platter",
        price: 58,
        description: "Skewers of shish tawook, beef kebab, and lamb chops with grilled vegetables.",
        image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&q=80&w=400",
        isVeg: false,
        category: "Arabian"
      },
      {
        id: "ym-10",
        name: "Baba Ganoush",
        price: 19,
        description: "Smoky roasted eggplant dip blended with tahini, olive oil, and pomegranate seeds.",
        image: "https://images.unsplash.com/photo-1639024471283-03518883512d?auto=format&fit=crop&q=80&w=400",
        isVeg: true,
        category: "Arabian"
      },
      {
        id: "ym-11",
        name: "Cheese Manakeesh",
        price: 15,
        description: "Freshly baked Lebanese flatbread topped with melting akkawi cheese.",
        image: "https://images.unsplash.com/photo-1574894709920-11b28e7367e3?auto=format&fit=crop&q=80&w=400",
        isVeg: true,
        category: "Arabian"
      }
    ]
  },
  {
    id: "asian-wok",
    name: "Asian Wok",
    rating: 4.6,
    reviewsCount: 1510,
    cuisines: ["Chinese", "Thai", "Asian"],
    deliveryTime: "20-25 mins",
    deliveryFee: 30,
    image: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&q=80&w=800",
    discount: "20% OFF",
    isPromoBadge: true,
    address: "Jumeirah Beach Road, Jumeirah 2",
    coordinates: { x: 65, y: 55 },
    menu: [
      {
        id: "aw-1",
        name: "Szechuan Chilli Noodles",
        price: 34,
        description: "Wok-tossed hand-pulled noodles with rich chili paste, sesame oil, and crunchy bell peppers.",
        image: "https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&q=80&w=400",
        isVeg: true,
        isBestseller: true,
        category: "Chinese"
      },
      {
        id: "aw-2",
        name: "Thai Green Curry with Jasmine Rice",
        price: 42,
        description: "Aromatic green curry paste coconut broth simmered with baby corn, bamboo shoots, and sweet basil.",
        image: "https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?auto=format&fit=crop&q=80&w=400",
        isVeg: true,
        isBestseller: true,
        category: "Healthy"
      },
      {
        id: "aw-3",
        name: "Crispy Honey Chilli Chicken",
        price: 36,
        description: "Golden fried chicken strips glazed with natural honey, sweet chili paste, and toasted sesame seeds.",
        image: "https://images.unsplash.com/photo-1525755662778-989d0524087e?auto=format&fit=crop&q=80&w=400",
        isVeg: false,
        category: "Chinese"
      },
      {
        id: "aw-4",
        name: "Steam Jasmine Rice",
        price: 12,
        description: "Fragrant, soft steamed Thai jasmine rice.",
        image: "https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?auto=format&fit=crop&q=80&w=400",
        isVeg: true,
        category: "Chinese"
      },
      {
        id: "aw-5",
        name: "Vegetable Spring Rolls (4 pcs)",
        price: 18,
        description: "Crispy deep-fried wrapper stuffed with shredded cabbage, carrots, and glass noodles.",
        image: "https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&q=80&w=400",
        isVeg: true,
        category: "Chinese"
      },
      {
        id: "aw-6",
        name: "Pad Thai Noodles",
        price: 38,
        description: "Stir-fried rice noodles with eggs, tofu, bean sprouts, crushed peanuts, and tangy tamarind sauce.",
        image: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&q=80&w=400",
        isVeg: false,
        category: "Chinese"
      },
      {
        id: "aw-7",
        name: "Dynamic Dim Sum Platter (8 pcs)",
        price: 39,
        description: "Assorted crystal veg and chicken dim sums served with house chili oil.",
        image: "https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&q=80&w=400",
        isVeg: false,
        category: "Chinese"
      },
      {
        id: "aw-8",
        name: "Tom Yum Soup",
        price: 22,
        description: "Spicy and sour clear soup flavored with lemongrass, kaffir lime, galangal, and fresh prawns.",
        image: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&q=80&w=400",
        isVeg: false,
        category: "Chinese"
      },
      {
        id: "aw-9",
        name: "Sticky Rice with Mango",
        price: 24,
        description: "Classic Thai dessert with sweet sticky rice, coconut milk glaze, and fresh mango slices.",
        image: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&q=80&w=400",
        isVeg: true,
        category: "Desserts"
      },
      {
        id: "aw-10",
        name: "Chicken Hakka Noodles",
        price: 32,
        description: "Wok-tossed noodles with shredded chicken and seasoned greens.",
        image: "https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&q=80&w=400",
        isVeg: false,
        category: "Chinese"
      },
      {
        id: "aw-11",
        name: "Black Pepper Beef",
        price: 44,
        description: "Tender beef slices wok-fried with crushed black pepper, capsicum, and oyster sauce.",
        image: "https://images.unsplash.com/photo-1525755662778-989d0524087e?auto=format&fit=crop&q=80&w=400",
        isVeg: false,
        category: "Chinese"
      }
    ]
  },
  {
    id: "burger-district",
    name: "Burger District",
    rating: 4.3,
    reviewsCount: 780,
    cuisines: ["Burgers", "Fast Food", "American"],
    deliveryTime: "15-20 mins",
    deliveryFee: 0,
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=800",
    discount: "15% OFF",
    isPromoBadge: true,
    address: "City Walk, Al Safa",
    coordinates: { x: 42, y: 72 },
    menu: [
      {
        id: "bd-burger-1",
        name: "Double Smash Beef Burger",
        price: 35,
        description: "Juicy. Cheesy. Absolutely Loaded! Two smashed angus patties, double cheddar cheese, house relish, and pickles in a warm brioche bun.",
        image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=400",
        isVeg: false,
        isBestseller: true,
        category: "Burger"
      },
      {
        id: "bd-burger-2",
        name: "Crunchy Nashville Hot Chicken Burger",
        price: 29,
        description: "Buttermilk fried chicken breast dipped in our hot chili oil glaze, topped with creamy slaw and pickles.",
        image: "https://images.unsplash.com/photo-1625813506062-0aeb1d7a094b?auto=format&fit=crop&q=80&w=400",
        isVeg: false,
        isBestseller: true,
        category: "Burger"
      },
      {
        id: "bd-burger-3",
        name: "Truffle Parmesan Fries",
        price: 18,
        description: "Hand-cut skin-on fries tossed in authentic white truffle oil, rosemary salt, and aged parmesan cheese.",
        image: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&q=80&w=400",
        isVeg: true,
        category: "Burger"
      },
      {
        id: "bd-burger-4",
        name: "Classic Cheeseburger",
        price: 24,
        description: "Single flame-grilled angus patty, cheddar cheese, pickles, and ketchup-mayo sauce.",
        image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=400",
        isVeg: false,
        category: "Burger"
      },
      {
        id: "bd-burger-5",
        name: "Smoky Bacon BBQ Burger",
        price: 32,
        description: "Grilled patty, crispy beef bacon, smoky BBQ sauce, onion rings, and swiss cheese.",
        image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=400",
        isVeg: false,
        category: "Burger"
      },
      {
        id: "bd-burger-6",
        name: "Crispy Mozzarella Sticks (6 pcs)",
        price: 16,
        description: "Golden-fried melting mozzarella cheese sticks served with marinara sauce.",
        image: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&q=80&w=400",
        isVeg: true,
        category: "Burger"
      },
      {
        id: "bd-burger-7",
        name: "Craft Onion Rings",
        price: 14,
        description: "Hand-battered sweet onion rings fried till ultra-crispy, with ranch dip.",
        image: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&q=80&w=400",
        isVeg: true,
        category: "Burger"
      },
      {
        id: "bd-burger-8",
        name: "Chocolate Milkshake",
        price: 18,
        description: "Thick, creamy milkshake made with premium Dutch chocolate ice cream and whipped cream.",
        image: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&q=80&w=400",
        isVeg: true,
        category: "Desserts"
      },
      {
        id: "bd-burger-9",
        name: "Spicy Jalapeno Poppers",
        price: 16,
        description: "Deep-fried jalapenos stuffed with spiced cream cheese, served with sweet chili sauce.",
        image: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&q=80&w=400",
        isVeg: true,
        category: "Burger"
      },
      {
        id: "bd-burger-10",
        name: "Ultimate Vegan Burger",
        price: 28,
        description: "Plant-based Beyond Meat patty, vegan cheddar, lettuce, tomatoes, and garlic aioli.",
        image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=400",
        isVeg: true,
        category: "Burger"
      },
      {
        id: "bd-burger-11",
        name: "Loaded Cheese Fries",
        price: 20,
        description: "Skin-on fries drenched in warm cheddar cheese sauce, jalapenos, and spring onions.",
        image: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&q=80&w=400",
        isVeg: true,
        category: "Burger"
      }
    ]
  },
  {
    id: "kebab-house",
    name: "Kebab House",
    rating: 4.7,
    reviewsCount: 1420,
    cuisines: ["Arabian", "Middle Eastern", "Kebabs"],
    deliveryTime: "22-28 mins",
    deliveryFee: 0,
    image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&q=80&w=800",
    discount: "Buy 1 Get 1",
    isPromoBadge: false,
    address: "Deira, Al Maktoum Road",
    coordinates: { x: 75, y: 25 },
    menu: [
      {
        id: "kh-1",
        name: "Shish Tawook Charcoal Skewers",
        price: 36,
        description: "Grilled cubes of chicken marinated in lemon, garlic, and Lebanese spices, served with fresh bread.",
        image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&q=80&w=400",
        isVeg: false,
        isBestseller: true,
        category: "Arabian"
      },
      {
        id: "kh-2",
        name: "Mezze Sharing Platter",
        price: 49,
        description: "A rich platter of hummus, mutabbal, tabbouleh, warak enab (grape leaves), and falafel, served with hot bread.",
        image: "https://images.unsplash.com/photo-1541518763669-27fef04b14ea?auto=format&fit=crop&q=80&w=400",
        isVeg: true,
        isBestseller: false,
        category: "Arabian"
      },
      {
        id: "kh-3",
        name: "Lamb Kofta Kebab",
        price: 42,
        description: "Spiced minced lamb skewers grilled over open charcoal, served with garlic sauce.",
        image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&q=80&w=400",
        isVeg: false,
        category: "Arabian"
      },
      {
        id: "kh-4",
        name: "Spicy Harra Potatoes",
        price: 16,
        description: "Crispy potato cubes tossed with garlic, fresh coriander, chili, and lemon juice.",
        image: "https://images.unsplash.com/photo-1541518763669-27fef04b14ea?auto=format&fit=crop&q=80&w=400",
        isVeg: true,
        category: "Arabian"
      },
      {
        id: "kh-5",
        name: "Hot Pita Bread",
        price: 3,
        description: "Freshly puffed Arabic flatbread straight from the oven.",
        image: "https://images.unsplash.com/photo-1541518763669-27fef04b14ea?auto=format&fit=crop&q=80&w=400",
        isVeg: true,
        category: "Arabian"
      },
      {
        id: "kh-6",
        name: "Cheese Sambousek (4 pcs)",
        price: 15,
        description: "Crispy pastry triangles stuffed with melting feta and mozzarella herbs mixture.",
        image: "https://images.unsplash.com/photo-1541518763669-27fef04b14ea?auto=format&fit=crop&q=80&w=400",
        isVeg: true,
        category: "Arabian"
      },
      {
        id: "kh-7",
        name: "Spinach Fatayer (4 pcs)",
        price: 14,
        description: "Traditional Lebanese triangular pies filled with tangy sumac-spiced spinach.",
        image: "https://images.unsplash.com/photo-1541518763669-27fef04b14ea?auto=format&fit=crop&q=80&w=400",
        isVeg: true,
        category: "Arabian"
      },
      {
        id: "kh-8",
        name: "Arabic Lentil Soup",
        price: 15,
        description: "Warm, creamy yellow lentil soup served with toasted pita chips and lemon wedges.",
        image: "https://images.unsplash.com/photo-1541518763669-27fef04b14ea?auto=format&fit=crop&q=80&w=400",
        isVeg: true,
        category: "Arabian"
      },
      {
        id: "kh-9",
        name: "Grilled Halloumi Cheese",
        price: 22,
        description: "Slices of premium Cypriot halloumi grilled golden, served with mint and olive oil.",
        image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&q=80&w=400",
        isVeg: true,
        category: "Arabian"
      },
      {
        id: "kh-10",
        name: "Rice Pudding with Pistachios",
        price: 14,
        description: "Sweet chilled milk-rice pudding flavored with rose water and cardamom.",
        image: "https://images.unsplash.com/photo-1587314168485-3236d6710814?auto=format&fit=crop&q=80&w=400",
        isVeg: true,
        category: "Desserts"
      },
      {
        id: "kh-11",
        name: "Warak Enab (Stuffed Grape Leaves)",
        price: 18,
        description: "Rolled vine leaves stuffed with seasoned rice, tomatoes, parsley, and lemon juice.",
        image: "https://images.unsplash.com/photo-1541518763669-27fef04b14ea?auto=format&fit=crop&q=80&w=400",
        isVeg: true,
        category: "Arabian"
      }
    ]
  },
  {
    id: "biryani-junction",
    name: "Biryani Junction",
    rating: 4.8,
    reviewsCount: 920,
    cuisines: ["Biryani", "Indian", "Mughlai"],
    deliveryTime: "20-25 mins",
    deliveryFee: 0,
    image: "https://images.unsplash.com/photo-1633945274405-b6c8069047b0?auto=format&fit=crop&q=80&w=800",
    discount: "30% OFF",
    isPromoBadge: true,
    address: "Oud Metha, Dubai",
    coordinates: { x: 32, y: 41 },
    menu: [
      {
        id: "bj-1",
        name: "Hyderabadi Dum Biryani",
        price: 38,
        description: "Traditional slow-cooked basmati rice layered with spiced chicken, mint, coriander, and fried onions.",
        image: "https://images.unsplash.com/photo-1633945274405-b6c8069047b0?auto=format&fit=crop&q=80&w=400",
        isVeg: false,
        isBestseller: true,
        category: "Biryani"
      },
      {
        id: "bj-2",
        name: "Lucknowi Mutton Biryani",
        price: 44,
        description: "Fragrant and mild Awadhi style biryani with tender mutton pieces infused with rose water and spices.",
        image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&q=80&w=400",
        isVeg: false,
        category: "Biryani"
      },
      {
        id: "bj-3",
        name: "Garlic Butter Naan",
        price: 6,
        description: "Fresh tandoor-baked flatbread glazed with melted butter and minced garlic.",
        image: "https://images.unsplash.com/photo-1601050690597-df056fb4ce78?auto=format&fit=crop&q=80&w=400",
        isVeg: true,
        category: "Indian"
      },
      {
        id: "bj-4",
        name: "Vegetable Dum Biryani",
        price: 32,
        description: "Fragrant basmati rice cooked with mixed vegetables, saffron, and mint on low heat.",
        image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&q=80&w=400",
        isVeg: true,
        category: "Biryani"
      },
      {
        id: "bj-5",
        name: "Chicken Tikka",
        price: 34,
        description: "Boneless chicken cubes marinated in tandoori yogurt spices and chargrilled.",
        image: "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?auto=format&fit=crop&q=80&w=400",
        isVeg: false,
        category: "Indian"
      },
      {
        id: "bj-6",
        name: "Tandoori Roti",
        price: 4,
        description: "Plain whole wheat unleavened bread baked in tandoor.",
        image: "https://images.unsplash.com/photo-1601050690597-df056fb4ce78?auto=format&fit=crop&q=80&w=400",
        isVeg: true,
        category: "Indian"
      },
      {
        id: "bj-7",
        name: "Raita (Mint & Cucumber)",
        price: 8,
        description: "Chilled spiced yogurt whipped with grated cucumber, roasted cumin, and mint.",
        image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&q=80&w=400",
        isVeg: true,
        category: "Indian"
      },
      {
        id: "bj-8",
        name: "Samosa Chaat",
        price: 18,
        description: "Smashed crispy potato samosas topped with spicy chickpeas, sweet yogurt, and tangy chutneys.",
        image: "https://images.unsplash.com/photo-1601050690597-df056fb4ce78?auto=format&fit=crop&q=80&w=400",
        isVeg: true,
        category: "Indian"
      },
      {
        id: "bj-9",
        name: "Paneer Tikka Masala",
        price: 36,
        description: "Grilled cottage cheese cubes in a rich and creamy spiced tomato-onion gravy.",
        image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&q=80&w=400",
        isVeg: true,
        category: "Indian"
      },
      {
        id: "bj-10",
        name: "Double Ka Meetha",
        price: 15,
        description: "Rich bread pudding soaked in saffron-infused milk and topped with dry fruits.",
        image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&q=80&w=400",
        isVeg: true,
        category: "Desserts"
      },
      {
        id: "bj-11",
        name: "Salan (Mirchi Ka Salan)",
        price: 10,
        description: "Traditional Hyderabad spicy peanut-sesame curry served as biryani accompaniment.",
        image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&q=80&w=400",
        isVeg: true,
        category: "Indian"
      }
    ]
  },
  {
    id: "la-dolce-vita",
    name: "La Dolce Vita",
    rating: 4.7,
    reviewsCount: 540,
    cuisines: ["Italian", "Pasta", "Pizza"],
    deliveryTime: "30-35 mins",
    deliveryFee: 0,
    image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80&w=800",
    discount: "15% OFF",
    isPromoBadge: false,
    address: "Marina Walk, Dubai Marina",
    coordinates: { x: 48, y: 32 },
    menu: [
      {
        id: "ldv-1",
        name: "Woodfired Margherita Pizza",
        price: 36,
        description: "Authentic san marzano tomato sauce, fresh buffalo mozzarella, fragrant basil leaves, and a drizzle of extra virgin olive oil.",
        image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=400",
        isVeg: true,
        isBestseller: true,
        category: "Italian"
      },
      {
        id: "ldv-2",
        name: "Creamy Fettuccine Carbonara",
        price: 42,
        description: "Classic rich cream sauce with egg yolk, crispy smoked bacon pieces, cracked black pepper, and grated parmesan.",
        image: "https://images.unsplash.com/photo-1645112411341-6c4fd023714a?auto=format&fit=crop&q=80&w=400",
        isVeg: false,
        isBestseller: true,
        category: "Italian"
      },
      {
        id: "ldv-3",
        name: "Garlic Bread with Cheese",
        price: 18,
        description: "Baked ciabatta slices spread with garlic herb butter and loaded with melted mozzarella cheese.",
        image: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&q=80&w=400",
        isVeg: true,
        category: "Italian"
      },
      {
        id: "ldv-4",
        name: "Lasagna Bolognese",
        price: 48,
        description: "Layers of fresh pasta with rich beef ragu, creamy bechamel, and golden parmesan crust.",
        image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80&w=400",
        isVeg: false,
        category: "Italian"
      },
      {
        id: "ldv-5",
        name: "Tiramisu",
        price: 25,
        description: "Classic Italian dessert with coffee-soaked ladyfingers, mascarpone cream, and cocoa powder.",
        image: "https://images.unsplash.com/photo-1587314168485-3236d6710814?auto=format&fit=crop&q=80&w=400",
        isVeg: true,
        category: "Desserts"
      },
      {
        id: "ldv-6",
        name: "Penne Arrabbiata",
        price: 32,
        description: "Tubular pasta in a spicy tomato sauce with garlic, chili flakes, and fresh parsley.",
        image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80&w=400",
        isVeg: true,
        category: "Italian"
      },
      {
        id: "ldv-7",
        name: "Caesar Salad",
        price: 24,
        description: "Crisp romaine lettuce tossed in creamy dressing, croutons, and shaved parmesan.",
        image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=400",
        isVeg: true,
        category: "Healthy"
      },
      {
        id: "ldv-8",
        name: "Quattro Formaggi Pizza",
        price: 44,
        description: "White woodfired pizza loaded with mozzarella, gorgonzola, parmesan, and provolone.",
        image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=400",
        isVeg: true,
        category: "Italian"
      },
      {
        id: "ldv-9",
        name: "Minestrone Soup",
        price: 18,
        description: "Hearty traditional vegetable soup with Italian herbs and ditalini pasta.",
        image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80&w=400",
        isVeg: true,
        category: "Healthy"
      },
      {
        id: "ldv-10",
        name: "Panna Cotta with Berries",
        price: 22,
        description: "Silk-smooth vanilla cream pudding topped with a sweet mixed berry coulis.",
        image: "https://images.unsplash.com/photo-1587314168485-3236d6710814?auto=format&fit=crop&q=80&w=400",
        isVeg: true,
        category: "Desserts"
      },
      {
        id: "ldv-11",
        name: "Bruschetta Pomodoro",
        price: 16,
        description: "Toasted artisan bread topped with diced tomatoes, garlic, basil, and balsamic glaze.",
        image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80&w=400",
        isVeg: true,
        category: "Italian"
      }
    ]
  },
  {
    id: "the-burger-lab",
    name: "The Burger Lab",
    rating: 4.5,
    reviewsCount: 670,
    cuisines: ["Burger", "Fast Food", "American"],
    deliveryTime: "15-20 mins",
    deliveryFee: 0,
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=800",
    discount: "Buy 1 Get 1",
    isPromoBadge: true,
    address: "DIFC, Dubai",
    coordinates: { x: 45, y: 48 },
    menu: [
      {
        id: "tbl-1",
        name: "Ultimate Lava Cheese Burger",
        price: 32,
        description: "Flame-grilled prime beef patty topped with a crispy cheese ring, smoky BBQ sauce, and grilled onions.",
        image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=400",
        isVeg: false,
        isBestseller: true,
        category: "Burger"
      },
      {
        id: "tbl-2",
        name: "Peri-Peri Crispy Chicken Burger",
        price: 28,
        description: "Spicy peri-peri marinated fried chicken breast, jalapenos, peri-mayo, and shredded lettuce in a sesame bun.",
        image: "https://images.unsplash.com/photo-1625813506062-0aeb1d7a094b?auto=format&fit=crop&q=80&w=400",
        isVeg: false,
        category: "Burger"
      },
      {
        id: "tbl-3",
        name: "Loaded Animal-Style Fries",
        price: 19,
        description: "Crispy skin-on fries topped with caramelized onions, cheddar cheese sauce, and secret burger spread.",
        image: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&q=80&w=400",
        isVeg: true,
        category: "Burger"
      },
      {
        id: "tbl-4",
        name: "Truffle Mushroom Swiss Burger",
        price: 34,
        description: "Grilled beef patty, melted Swiss cheese, sautéed wild mushrooms, and black truffle aioli.",
        image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=400",
        isVeg: false,
        category: "Burger"
      },
      {
        id: "tbl-5",
        name: "Sweet Potato Fries",
        price: 15,
        description: "Golden-fried crispy sweet potato fries served with chipotle dipping sauce.",
        image: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&q=80&w=400",
        isVeg: true,
        category: "Burger"
      },
      {
        id: "tbl-6",
        name: "Buttermilk Onion Rings",
        price: 12,
        description: "Extra crunchy hand-battered rings served with house signature sauce.",
        image: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&q=80&w=400",
        isVeg: true,
        category: "Burger"
      },
      {
        id: "tbl-7",
        name: "Vanilla Bean Shake",
        price: 18,
        description: "Creamy milk shake blended with organic Madagascar vanilla bean ice cream.",
        image: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&q=80&w=400",
        isVeg: true,
        category: "Desserts"
      },
      {
        id: "tbl-8",
        name: "Spicy Buffalo Chicken Wings (8 pcs)",
        price: 24,
        description: "Crispy wings tossed in buffalo sauce, served with celery sticks and blue cheese dip.",
        image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=400",
        isVeg: false,
        category: "Burger"
      },
      {
        id: "tbl-9",
        name: "Grilled Chicken Avocado Club",
        price: 30,
        description: "Grilled chicken breast, fresh avocado mash, smoked bacon, tomato, and lettuce in toasted brioche.",
        image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=400",
        isVeg: false,
        category: "Burger"
      },
      {
        id: "tbl-10",
        name: "Chili Cheese Poppers",
        price: 16,
        description: "Spicy breaded cheese nuggets stuffed with minced green chilies and cream cheese.",
        image: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&q=80&w=400",
        isVeg: true,
        category: "Burger"
      },
      {
        id: "tbl-11",
        name: "Classic Caesar Salad with Grilled Chicken",
        price: 28,
        description: "Romaine lettuce, parmesan cheese, crispy garlic croutons, grilled chicken breast, and creamy Caesar dressing.",
        image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=400",
        isVeg: false,
        category: "Healthy"
      }
    ]
  },
  {
    id: "sweet-treats-co",
    name: "Sweet Treats & Co.",
    rating: 4.9,
    reviewsCount: 480,
    cuisines: ["Desserts", "Bakery", "Cakes"],
    deliveryTime: "25-30 mins",
    deliveryFee: 35,
    image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&q=80&w=800",
    discount: "Flat 20% OFF",
    isPromoBadge: true,
    address: "Al Wasl Rd, Dubai",
    coordinates: { x: 38, y: 58 },
    menu: [
      {
        id: "stc-1",
        name: "Chocolate Fudge Lava Cake",
        price: 24,
        description: "Warm, rich chocolate cake with a molten chocolate center, served with powdered sugar.",
        image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&q=80&w=400",
        isVeg: true,
        isBestseller: true,
        category: "Desserts"
      },
      {
        id: "stc-2",
        name: "Red Velvet Cupcakes (2 pcs)",
        price: 18,
        description: "Classic cocoa cupcakes colored crimson, topped with rich, creamy vanilla cream cheese frosting.",
        image: "https://images.unsplash.com/photo-1614707267537-b85acf00c4b8?auto=format&fit=crop&q=80&w=400",
        isVeg: true,
        category: "Desserts"
      },
      {
        id: "stc-3",
        name: "Warm Apple Pie",
        price: 22,
        description: "Traditional spiced apple pie with a flaky golden crust, loaded with apples and cinnamon flavor.",
        image: "https://images.unsplash.com/photo-1507226983735-a838615193b0?auto=format&fit=crop&q=80&w=400",
        isVeg: true,
        isBestseller: true,
        category: "Desserts"
      },
      {
        id: "stc-4",
        name: "Gourmet Chocolate Chip Cookies (3 pcs)",
        price: 12,
        description: "Soft-baked giant cookies loaded with semi-sweet Belgian chocolate chips.",
        image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&q=80&w=400",
        isVeg: true,
        category: "Desserts"
      },
      {
        id: "stc-5",
        name: "Vanilla Crème Brûlée",
        price: 26,
        description: "Rich custard base topped with a texturally contrasting layer of hardened caramelized sugar.",
        image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&q=80&w=400",
        isVeg: true,
        category: "Desserts"
      },
      {
        id: "stc-6",
        name: "NY Style Blueberry Cheesecake",
        price: 28,
        description: "Dense, rich cream cheese cake on a graham cracker crust, topped with fresh blueberry compote.",
        image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&q=80&w=400",
        isVeg: true,
        category: "Desserts"
      },
      {
        id: "stc-7",
        name: "Double Chocolate Brownie with Walnuts",
        price: 16,
        description: "Fudgy rich chocolate brownie loaded with roasted walnut pieces and dark chocolate chunks.",
        image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&q=80&w=400",
        isVeg: true,
        category: "Desserts"
      },
      {
        id: "stc-8",
        name: "Fresh Strawberry Tart",
        price: 20,
        description: "Sweet pastry shell filled with vanilla pastry cream and decorated with glazed strawberries.",
        image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&q=80&w=400",
        isVeg: true,
        category: "Desserts"
      },
      {
        id: "stc-9",
        name: "Macarons Gift Box (6 pcs)",
        price: 35,
        description: "Colorful delicate French meringue cookies with chocolate ganache, pistachio, and vanilla filling.",
        image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&q=80&w=400",
        isVeg: true,
        category: "Desserts"
      },
      {
        id: "stc-10",
        name: "Salted Caramel Waffle",
        price: 22,
        description: "Crispy waffle drizzled with house-made salted caramel sauce and toasted pecans.",
        image: "https://images.unsplash.com/photo-1562376502-6f769499c886?auto=format&fit=crop&q=80&w=400",
        isVeg: true,
        category: "Desserts"
      },
      {
        id: "stc-11",
        name: "Creamy Tiramisu Cup",
        price: 24,
        description: "Individual espresso-soaked biscuit layers topped with rich whipped mascarpone.",
        image: "https://images.unsplash.com/photo-1587314168485-3236d6710814?auto=format&fit=crop&q=80&w=400",
        isVeg: true,
        category: "Desserts"
      }
    ]
  },
  {
    id: "green-lean-salads",
    name: "Green & Lean Salads",
    rating: 4.6,
    reviewsCount: 390,
    cuisines: ["Healthy", "Salads", "Vegetarian"],
    deliveryTime: "20-25 mins",
    deliveryFee: 0,
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=800",
    discount: "10% OFF",
    isPromoBadge: false,
    address: "Business Bay, Dubai",
    coordinates: { x: 41, y: 39 },
    menu: [
      {
        id: "gls-1",
        name: "Avocado Quinoa Power Bowl",
        price: 35,
        description: "Nutritious bowl filled with organic quinoa, fresh avocado, edamame, cherry tomatoes, and tahini lemon dressing.",
        image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=400",
        isVeg: true,
        isBestseller: true,
        category: "Healthy"
      },
      {
        id: "gls-2",
        name: "Grilled Salmon Salad",
        price: 45,
        description: "Fresh oak leaf lettuce tossed with grilled pink salmon fillet, asparagus, cucumbers, and a zesty olive oil vinaigrette.",
        image: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&q=80&w=400",
        isVeg: false,
        isBestseller: true,
        category: "Healthy"
      },
      {
        id: "gls-3",
        name: "Fresh Cold-Pressed Orange Juice",
        price: 15,
        description: "100% natural pure orange juice extracted fresh daily without added sugar or preservatives.",
        image: "https://images.unsplash.com/photo-1613478223719-2ab802602423?auto=format&fit=crop&q=80&w=400",
        isVeg: true,
        category: "Healthy"
      },
      {
        id: "gls-4",
        name: "Detox Green Juice",
        price: 16,
        description: "Pure cold-pressed juice from kale, cucumber, green apple, celery, and fresh lemon.",
        image: "https://images.unsplash.com/photo-1613478223719-2ab802602423?auto=format&fit=crop&q=80&w=400",
        isVeg: true,
        category: "Healthy"
      },
      {
        id: "gls-5",
        name: "Greek Feta & Olive Salad",
        price: 24,
        description: "Crisp cucumbers, juicy cherry tomatoes, kalamata olives, red onions, and imported block feta.",
        image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=400",
        isVeg: true,
        category: "Healthy"
      },
      {
        id: "gls-6",
        name: "Sweet Potato & Chickpea Bowl",
        price: 28,
        description: "Roasted sweet potato chunks, spiced organic chickpeas, baby spinach, and tahini dressing.",
        image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=400",
        isVeg: true,
        category: "Healthy"
      },
      {
        id: "gls-7",
        name: "Acai Superfood Bowl",
        price: 32,
        description: "Blended organic acai berry puree topped with gluten-free granola, chia seeds, and sliced banana.",
        image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=400",
        isVeg: true,
        category: "Healthy"
      },
      {
        id: "gls-8",
        name: "Grilled Tofu & Broccoli Buddha Bowl",
        price: 30,
        description: "Sesame grilled organic tofu, steamed broccoli, brown rice, edamame, and ginger-soy dressing.",
        image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=400",
        isVeg: true,
        category: "Healthy"
      },
      {
        id: "gls-9",
        name: "Vegan Lentil & Vegetable Soup",
        price: 18,
        description: "Wholesome hot soup loaded with brown lentils, garden vegetables, and Italian herbs.",
        image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=400",
        isVeg: true,
        category: "Healthy"
      },
      {
        id: "gls-10",
        name: "Raw Chia Seed Coconut Pudding",
        price: 15,
        description: "Coconut milk soaked chia seeds flavored with vanilla and topped with mixed berries.",
        image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=400",
        isVeg: true,
        category: "Healthy"
      },
      {
        id: "gls-11",
        name: "Grilled Chicken Caesar Wrap",
        price: 26,
        description: "Whole-wheat tortilla wrapping grilled lean chicken, romaine, parmesan, and low-fat caesar dressing.",
        image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=400",
        isVeg: false,
        category: "Healthy"
      }
    ]
  },
  {
    id: "the-golden-dragon",
    name: "The Golden Dragon",
    rating: 4.4,
    reviewsCount: 810,
    cuisines: ["Chinese", "Asian", "Thai"],
    deliveryTime: "25-30 mins",
    deliveryFee: 0,
    image: "https://images.unsplash.com/photo-1525755662778-989d0524087e?auto=format&fit=crop&q=80&w=800",
    discount: "Free Spring Rolls",
    isPromoBadge: true,
    address: "Al Karama, Dubai",
    coordinates: { x: 31, y: 31 },
    menu: [
      {
        id: "tgd-1",
        name: "Beijing Kung Pao Chicken",
        price: 38,
        description: "Wok-fired tender chicken cubes with dry red chilies, roasted peanuts, and green peppers in a rich garlic-soy glaze.",
        image: "https://images.unsplash.com/photo-1525755662778-989d0524087e?auto=format&fit=crop&q=80&w=400",
        isVeg: false,
        isBestseller: true,
        category: "Chinese"
      },
      {
        id: "tgd-2",
        name: "Vegetable Hakka Noodles",
        price: 26,
        description: "Classic fast-wok noodles tossed with julienned cabbage, carrots, spring onions, and a splash of soy sauce.",
        image: "https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&q=80&w=400",
        isVeg: true,
        category: "Chinese"
      },
      {
        id: "tgd-3",
        name: "Steam Chicken Momos (6 pcs)",
        price: 22,
        description: "Soft Himalayan dumplings packed with minced chicken and herbs, steamed and served with hot sesame chili sauce.",
        image: "https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&q=80&w=400",
        isVeg: false,
        isBestseller: true,
        category: "Chinese"
      },
      {
        id: "tgd-4",
        name: "Crispy Vegetable Spring Rolls (4 pcs)",
        price: 16,
        description: "Classic crispy wrappers filled with julienned vegetables and served with sweet plum sauce.",
        image: "https://images.unsplash.com/photo-1525755662778-989d0524087e?auto=format&fit=crop&q=80&w=400",
        isVeg: true,
        category: "Chinese"
      },
      {
        id: "tgd-5",
        name: "Sweet & Sour Prawns",
        price: 45,
        description: "Tempura-battered prawns tossed with pineapple, onions, and bell peppers in a tangy sweet-sour glaze.",
        image: "https://images.unsplash.com/photo-1525755662778-989d0524087e?auto=format&fit=crop&q=80&w=400",
        isVeg: false,
        category: "Chinese"
      },
      {
        id: "tgd-6",
        name: "Szechuan Mapo Tofu",
        price: 28,
        description: "Soft silken tofu stewed in a fiery, spicy bean paste and sichuan pepper sauce.",
        image: "https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&q=80&w=400",
        isVeg: true,
        category: "Chinese"
      },
      {
        id: "tgd-7",
        name: "Egg Fried Rice",
        price: 20,
        description: "Fragrant jasmine rice wok-fried with fresh farm eggs, green peas, and scallions.",
        image: "https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&q=80&w=400",
        isVeg: false,
        category: "Chinese"
      },
      {
        id: "tgd-8",
        name: "Hot & Sour Chicken Soup",
        price: 15,
        description: "Spicy, tangy thickened chicken broth with wood-ear mushrooms, bamboo shoots, and tofu.",
        image: "https://images.unsplash.com/photo-1525755662778-989d0524087e?auto=format&fit=crop&q=80&w=400",
        isVeg: false,
        category: "Chinese"
      },
      {
        id: "tgd-9",
        name: "Black Pepper Chicken",
        price: 36,
        description: "Sliced chicken breast wok-fired with cracked black peppercorns and bell peppers.",
        image: "https://images.unsplash.com/photo-1525755662778-989d0524087e?auto=format&fit=crop&q=80&w=400",
        isVeg: false,
        category: "Chinese"
      },
      {
        id: "tgd-10",
        name: "Chili Garlic Crispy Potatoes",
        price: 22,
        description: "Thin potato strips fried extra-crispy and tossed in sweet garlic-chili oil glaze.",
        image: "https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&q=80&w=400",
        isVeg: true,
        category: "Chinese"
      },
      {
        id: "tgd-11",
        name: "Fried Sesame Banana with Ice Cream",
        price: 18,
        description: "Honey-glazed hot fried banana coated in sesame seeds, served with a scoop of vanilla.",
        image: "https://images.unsplash.com/photo-1587314168485-3236d6710814?auto=format&fit=crop&q=80&w=400",
        isVeg: true,
        category: "Desserts"
      }
    ]
  },
  {
    id: "al-sultan-grill",
    name: "Al Sultan Mandi & Grill",
    rating: 4.8,
    reviewsCount: 1150,
    cuisines: ["Arabian", "Middle Eastern", "Grills"],
    deliveryTime: "25-30 mins",
    deliveryFee: 0,
    image: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=800",
    discount: "Flat 20% OFF",
    isPromoBadge: true,
    address: "Sheikh Zayed Rd, Dubai",
    coordinates: { x: 36, y: 46 },
    menu: [
      {
        id: "asg-1",
        name: "Royal Chicken Mandi",
        price: 49,
        description: "Slow-smoked chicken served over a bed of fragrant basmati mandi rice, roasted almonds, and spicy tomato daqqous sauce.",
        image: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=400",
        isVeg: false,
        isBestseller: true,
        category: "Arabian"
      },
      {
        id: "asg-2",
        name: "Mutton Kofta Kebab",
        price: 42,
        description: "Flame-grilled skewers of minced spiced mutton, roasted onions, and garlic toum, wrapped in hot flatbread.",
        image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&q=80&w=400",
        isVeg: false,
        category: "Arabian"
      },
      {
        id: "asg-3",
        name: "Warm Kunafa Dessert",
        price: 25,
        description: "Traditional Middle Eastern cheese pastry soaked in sweet sugar syrup, baked crisp and sprinkled with ground pistachios.",
        image: "https://images.unsplash.com/photo-1587314168485-3236d6710814?auto=format&fit=crop&q=80&w=400",
        isVeg: true,
        isBestseller: true,
        category: "Desserts"
      },
      {
        id: "asg-4",
        name: "Shish Tawook Plate",
        price: 38,
        description: "Chargrilled marinated chicken skewers served on golden rice with garlic sauce.",
        image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&q=80&w=400",
        isVeg: false,
        category: "Arabian"
      },
      {
        id: "asg-5",
        name: "Creamy Hummus Dip",
        price: 14,
        description: "Smooth blended chickpeas, tahini, lemon, and premium olive oil, with hot pita.",
        image: "https://images.unsplash.com/photo-1541518763669-27fef04b14ea?auto=format&fit=crop&q=80&w=400",
        isVeg: true,
        category: "Arabian"
      },
      {
        id: "asg-6",
        name: "Baba Ghanoush Eggplant Salad",
        price: 16,
        description: "Smoky mashed eggplant blended with diced tomatoes, onions, olive oil, and lemon.",
        image: "https://images.unsplash.com/photo-1541518763669-27fef04b14ea?auto=format&fit=crop&q=80&w=400",
        isVeg: true,
        category: "Arabian"
      },
      {
        id: "asg-7",
        name: "Fresh Tabbouleh Salad",
        price: 15,
        description: "Finely chopped fresh parsley, mint, tomatoes, cracked wheat, olive oil, and lemon juice.",
        image: "https://images.unsplash.com/photo-1541518763669-27fef04b14ea?auto=format&fit=crop&q=80&w=400",
        isVeg: true,
        category: "Arabian"
      },
      {
        id: "asg-8",
        name: "Arabian Grilled Whole Chicken",
        price: 55,
        description: "Tender spiced whole chicken slow-grilled on charcoal, served with toum and pickles.",
        image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&q=80&w=400",
        isVeg: false,
        category: "Arabian"
      },
      {
        id: "asg-9",
        name: "Arabic Lentil Soup with Lemon",
        price: 14,
        description: "Hearty yellow lentil soup served with fried bread croutons and fresh lemon.",
        image: "https://images.unsplash.com/photo-1541518763669-27fef04b14ea?auto=format&fit=crop&q=80&w=400",
        isVeg: true,
        category: "Arabian"
      },
      {
        id: "asg-10",
        name: "Hot Pita Bread Basket",
        price: 4,
        description: "A basket of four fresh tandoor-baked flat pita breads.",
        image: "https://images.unsplash.com/photo-1541518763669-27fef04b14ea?auto=format&fit=crop&q=80&w=400",
        isVeg: true,
        category: "Arabian"
      },
      {
        id: "asg-11",
        name: "Spiced Mandi Rice Extra",
        price: 12,
        description: "Generous extra portion of our signature aromatic long-grain basmati Mandi rice.",
        image: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=400",
        isVeg: true,
        category: "Arabian"
      }
    ]
  }
];
const getStoredRestaurants = () => {
  const localSaved = localStorage.getItem("globaleats_restaurants");
  if (localSaved) {
    try {
      const parsed = JSON.parse(localSaved);
      if (Array.isArray(parsed) && parsed.length >= INITIAL_RESTAURANTS.length) {
        return parsed;
      }
    } catch {
      // Ignore JSON parse errors
    }
  }
  return INITIAL_RESTAURANTS;
};
export let RESTAURANTS = getStoredRestaurants();
export const saveRestaurantsToStorage = (updatedList) => {
  dinerService.updateRestaurant(updatedList);
};
export const REELS = [
  {
    id: "reel-1",
    restaurantId: "bombay-darling",
    restaurantName: "Bombay Darling",
    logo: "BD",
    logoColor: "from-amber-500 to-orange-600",
    offer: "30% OFF",
    offerColor: "bg-orange-500",
    bgImage: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&q=80&w=600",
    title: "Aromatic Dum Biryani",
    tag: "🔥 Trending",
    tagColor: "bg-red-500",
    description: "Layered saffron rice with slow-dum cooked tender meat.",
    rating: "4.8",
    deliveryTime: "25 mins",
    orderNowItem: { id: "bd-1", name: "Special Chicken Biryani", price: 39 }
  },
  {
    id: "reel-2",
    restaurantId: "tikka-masala",
    restaurantName: "Tikka Masala",
    logo: "TM",
    logoColor: "from-rose-500 to-pink-600",
    offer: "NEW LAUNCH",
    offerColor: "bg-pink-600",
    bgImage: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=600",
    title: "Butter Chicken Pizza",
    tag: "✨ New",
    tagColor: "bg-purple-600",
    description: "Fusion at its finest — creamy butter chicken on mozzarella crust.",
    rating: "4.6",
    deliveryTime: "20 mins",
    orderNowItem: { id: "tm-2", name: "Butter Chicken Pizza", price: 38 }
  },
  {
    id: "reel-3",
    restaurantId: "yalla-manila",
    restaurantName: "Yalla Manila",
    logo: "YM",
    logoColor: "from-teal-500 to-emerald-600",
    offer: "BUY 1 GET 1",
    offerColor: "bg-emerald-600",
    bgImage: "https://images.unsplash.com/photo-1574894709920-11b28e7367e3?auto=format&fit=crop&q=80&w=600",
    title: "Loaded Shawarma Bowl",
    tag: "🥙 Fan Fav",
    tagColor: "bg-teal-600",
    description: "Juicy shaved chicken on garlic rice with creamy hummus.",
    rating: "4.5",
    deliveryTime: "28 mins",
    orderNowItem: { id: "ym-1", name: "Premium Shawarma Bowl", price: 29 }
  },
  {
    id: "reel-4",
    restaurantId: "asian-wok",
    restaurantName: "Asian Wok",
    logo: "AW",
    logoColor: "from-red-500 to-orange-500",
    offer: "WOK FRESH",
    offerColor: "bg-red-500",
    bgImage: "https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&q=80&w=600",
    title: "Chilli Garlic Noodles",
    tag: "🌶️ Spicy Hit",
    tagColor: "bg-red-600",
    description: "High-heat wok noodles with smoky garlic and Schezwan fire.",
    rating: "4.7",
    deliveryTime: "22 mins",
    orderNowItem: { id: "aw-1", name: "Szechuan Chilli Noodles", price: 34 }
  },
  {
    id: "reel-5",
    restaurantId: "burger-district",
    restaurantName: "Burger District",
    logo: "BD",
    logoColor: "from-yellow-500 to-amber-600",
    offer: "FREE FRIES",
    offerColor: "bg-yellow-600",
    bgImage: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=600",
    title: "Double Smash Burger",
    tag: "🍔 Bestseller",
    tagColor: "bg-amber-600",
    description: "Two smashed angus patties, double cheddar, brioche bun — iconic.",
    rating: "4.4",
    deliveryTime: "18 mins",
    orderNowItem: { id: "bd-burger-1", name: "Double Smash Beef Burger", price: 35 }
  },
  {
    id: "reel-6",
    restaurantId: "kebab-house",
    restaurantName: "Kebab House",
    logo: "KH",
    logoColor: "from-orange-600 to-red-600",
    offer: "GRILLED FRESH",
    offerColor: "bg-orange-600",
    bgImage: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&q=80&w=600",
    title: "Shish Tawook Kebabs",
    tag: "🔥 Charcoal",
    tagColor: "bg-orange-700",
    description: "Charcoal-grilled skewers with zesty garlic sauce and pita.",
    rating: "4.9",
    deliveryTime: "25 mins",
    orderNowItem: { id: "kh-1", name: "Shish Tawook Charcoal Skewers", price: 36 }
  },
  {
    id: "reel-7",
    restaurantId: "biryani-junction",
    restaurantName: "Biryani Junction",
    logo: "BJ",
    logoColor: "from-yellow-600 to-amber-700",
    offer: "40% OFF",
    offerColor: "bg-yellow-500",
    bgImage: "https://images.unsplash.com/photo-1633945274405-b6c8069047b0?auto=format&fit=crop&q=80&w=600",
    title: "Hyderabadi Dum Biryani",
    tag: "👑 Royal Pick",
    tagColor: "bg-yellow-700",
    description: "Traditional slow-cooked Hyderabadi biryani with fried onions.",
    rating: "4.8",
    deliveryTime: "23 mins",
    orderNowItem: { id: "bj-1", name: "Hyderabadi Dum Biryani", price: 38 }
  },
  {
    id: "reel-8",
    restaurantId: "asian-wok",
    restaurantName: "Asian Wok",
    logo: "AW",
    logoColor: "from-sky-500 to-blue-600",
    offer: "CHEF SPECIAL",
    offerColor: "bg-sky-600",
    bgImage: "https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?auto=format&fit=crop&q=80&w=600",
    title: "Thai Green Curry",
    tag: "🌿 Healthy",
    tagColor: "bg-green-600",
    description: "Coconut curry broth with bamboo shoots, baby corn & sweet basil.",
    rating: "4.6",
    deliveryTime: "20 mins",
    orderNowItem: { id: "aw-2", name: "Thai Green Curry", price: 42 }
  }
];
export const CATEGORIES = [
  { id: "all", name: "All", icon: "🍽️" },
  { id: "biryani", name: "Biryani", icon: "🍲" },
  { id: "indian", name: "Indian", icon: "🍛" },
  { id: "chinese", name: "Chinese", icon: "🥢" },
  { id: "arabian", name: "Arabian", icon: "🥙" },
  { id: "italian", name: "Italian", icon: "🍕" },
  { id: "healthy", name: "Healthy", icon: "🥗" },
  { id: "burger", name: "Burger", icon: "🍔" },
  { id: "desserts", name: "Desserts", icon: "🍰" },
  { id: "mexican", name: "Mexican", icon: "🌮" },
  { id: "japanese", name: "Japanese", icon: "🍣" },
  { id: "turkish", name: "Turkish", icon: "🥙" },
  { id: "american", name: "American", icon: "🍔" },
  { id: "more", name: "More", icon: "🍿" }
];
export const PROMOTIONS = [
  {
    id: "promo-main",
    title: "FLAT 40% OFF",
    subtitle: "ON ORDERS ABOVE ₹ 100",
    code: "FOOD40",
    bgColor: "from-orange-600 to-amber-500",
    image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=400",
    minAmount: 100,
    discountPercent: 40
  },
  {
    id: "promo-welcome",
    title: "50% OFF ON FIRST ORDER",
    subtitle: "Use Code: WELCOME50",
    code: "WELCOME50",
    bgColor: "from-blue-600 to-indigo-500",
    image: "https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&q=80&w=400",
    minAmount: 50,
    discountPercent: 50
  },
  {
    id: "promo-freedel",
    title: "Free Delivery",
    subtitle: "ON FIRST ORDER",
    code: "FREEDEL",
    bgColor: "from-emerald-500 to-teal-600",
    image: "https://images.unsplash.com/photo-1526367790999-0150786486a9?auto=format&fit=crop&q=80&w=400"
  }
];
export const OFFER_CARDS = [
  {
    title: "₹ 10 OFF",
    condition: "ON ORDERS ABOVE ₹ 49",
    code: "SAVE10",
    color: "bg-emerald-50 text-emerald-800 border-emerald-200"
  },
  {
    title: "50% OFF",
    condition: "UP TO ₹ 20 ON ORDERS",
    code: "HALF120",
    color: "bg-indigo-50 text-indigo-800 border-indigo-200"
  },
  {
    title: "FLAT 30% OFF",
    condition: "ON ORDERS ABOVE ₹ 59",
    code: "YUM30",
    color: "bg-amber-50 text-amber-800 border-amber-200"
  },
  {
    title: "FREE DELIVERY",
    condition: "ON ORDERS ABOVE ₹ 39",
    code: "FREEDEL",
    color: "bg-rose-50 text-rose-800 border-rose-200"
  }
];
export const COLLECTIONS = [
  {
    id: "trending",
    title: "Trending Now",
    subtitle: "Most Ordered",
    image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80&w=300"
  },
  {
    id: "biryani-lovers",
    title: "Biryani Lovers",
    subtitle: "Top Biryani Places",
    image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&q=80&w=300"
  },
  {
    id: "great-offers",
    title: "Great Offers",
    subtitle: "Best Discounts",
    image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=300"
  },
  {
    id: "late-night",
    title: "Late Night Eats",
    subtitle: "Open Till Late",
    image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=300"
  },
  {
    id: "healthy-choices",
    title: "Healthy Choices",
    subtitle: "Eat Healthy",
    image: "https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&q=80&w=300"
  }
];
export const POPULAR_CUISINES = [
  {
    id: "indian",
    name: "Indian",
    outlets: "1500+ Outlets",
    image: "https://images.unsplash.com/photo-1625398407796-82650a8c135f?q=80&w=300"
  },
  {
    id: "chinese",
    name: "Chinese",
    outlets: "1200+ Outlets",
    image: "https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&q=80&w=300"
  },
  {
    id: "italian",
    name: "Italian",
    outlets: "800+ Outlets",
    image: "https://images.unsplash.com/photo-1595295333158-4742f28fbd85?auto=format&fit=crop&q=80&w=300"
  },
  {
    id: "arabian",
    name: "Arabian",
    outlets: "700+ Outlets",
    image: "https://images.unsplash.com/photo-1574894709920-11b28e7367e3?auto=format&fit=crop&q=80&w=300"
  },
  {
    id: "thai",
    name: "Thai",
    outlets: "600+ Outlets",
    image: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?q=80&w=300&auto=format&fit=crop"
  },
  {
    id: "mexican",
    name: "Mexican",
    outlets: "500+ Outlets",
    image: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&q=80&w=300"
  },
  {
    id: "burger",
    name: "Burgers",
    outlets: "950+ Outlets",
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=300"
  },
  {
    id: "desserts",
    name: "Desserts",
    outlets: "1100+ Outlets",
    image: "https://images.unsplash.com/photo-1587314168485-3236d6710814?auto=format&fit=crop&q=80&w=300"
  },
  {
    id: "healthy",
    name: "Healthy",
    outlets: "450+ Outlets",
    image: "https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&q=80&w=300"
  },
  {
    id: "japanese",
    name: "Japanese",
    outlets: "350+ Outlets",
    image: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&q=80&w=300"
  },
  {
    id: "turkish",
    name: "Turkish",
    outlets: "300+ Outlets",
    image: "https://images.unsplash.com/photo-1524351199679-46cddf530c04?auto=format&fit=crop&q=80&w=300"
  },
  {
    id: "american",
    name: "American",
    outlets: "400+ Outlets",
    image: "https://images.unsplash.com/photo-1534790566766-0b178a21b5b5?auto=format&fit=crop&q=80&w=300"
  }
];
export const INITIAL_DETAILED_OFFERS = [
  // 1. BANK OFFERS
  {
    id: "bank-hsbc",
    category: "bank",
    title: "HSBC Cards Special",
    discount: "20% OFF (Up to ₹ 25)",
    code: "HSBC20",
    expiry: "31 Dec 2026",
    desc: "Get flat 20% off on premium dining outlets. Applicable on HSBC Debit & Credit cards.",
    minOrder: 50,
    iconName: "credit-card",
    accentColor: "text-rose-600 bg-rose-50 border-rose-200",
    colorTheme: "rose"
  },
  {
    id: "bank-enbd",
    category: "bank",
    title: "Emirates NBD Discount",
    discount: "Flat 25% OFF (Up to ₹ 30)",
    code: "ENBD25",
    expiry: "15 Nov 2026",
    desc: "Savor your favorites with Emirates NBD card payments. Minimum transaction ₹ 60.",
    minOrder: 60,
    iconName: "credit-card",
    accentColor: "text-blue-600 bg-blue-50 border-blue-200",
    colorTheme: "blue"
  },
  {
    id: "bank-mastercard",
    category: "bank",
    title: "Mastercard World Offer",
    discount: "Flat ₹ 15 OFF",
    code: "MCWORLD",
    expiry: "31 Aug 2026",
    desc: "Enjoy discount with any Mastercard World Elite or Platinum card. Minimum transaction ₹ 50.",
    minOrder: 50,
    iconName: "credit-card",
    accentColor: "text-amber-600 bg-amber-50 border-amber-200",
    colorTheme: "amber"
  },
  // 2. FESTIVAL OFFERS
  {
    id: "fest-eid",
    category: "festival",
    title: "Eid Feast Celebration",
    discount: "30% OFF (Up to ₹ 40)",
    code: "EIDFEAST",
    expiry: "10 Jul 2026",
    desc: "Share the joy with friends and family. Valid on all orders above ₹ 50.",
    minOrder: 50,
    iconName: "sparkles",
    accentColor: "text-emerald-600 bg-emerald-50 border-emerald-200",
    colorTheme: "emerald"
  },
  {
    id: "fest-diwali",
    category: "festival",
    title: "Diwali Festive Lights",
    discount: "50% OFF (Up to ₹ 50)",
    code: "DIWALI50",
    expiry: "15 Nov 2026",
    desc: "Celebrate the festival of lights with royal feasts. Valid on premium Indian & Arabian menus.",
    minOrder: 80,
    iconName: "sparkles",
    accentColor: "text-orange-600 bg-orange-50 border-orange-200",
    colorTheme: "orange"
  },
  {
    id: "fest-summer",
    category: "festival",
    title: "Summer Chill Delights",
    discount: "Flat ₹ 20 OFF",
    code: "CHILLY20",
    expiry: "31 Aug 2026",
    desc: "Beat the heat with ice creams, mocktails and fresh juices. Minimum transaction ₹ 50.",
    minOrder: 50,
    iconName: "sparkles",
    accentColor: "text-sky-600 bg-sky-50 border-sky-200",
    colorTheme: "sky"
  },
  // 3. RESTAURANT OFFERS
  {
    id: "rest-kfc",
    category: "restaurant",
    title: "KFC Crispy Feast Deal",
    discount: "Flat ₹ 15 OFF",
    code: "KFCFREE",
    expiry: "30 Sep 2026",
    desc: "Order legendary finger-lickin good buckets. Valid on KFC outlet orders above ₹ 45.",
    minOrder: 45,
    iconName: "store",
    accentColor: "text-red-600 bg-red-50 border-red-200",
    colorTheme: "red"
  },
  {
    id: "rest-pizza",
    category: "restaurant",
    title: "Pizza Hut Lovers Deal",
    discount: "25% OFF (Up to ₹ 20)",
    code: "PIZZALOVE",
    expiry: "30 Oct 2026",
    desc: "Get your cheesy hand-tossed personal or medium pizza sliced perfectly. Minimum order ₹ 50.",
    minOrder: 50,
    iconName: "store",
    accentColor: "text-yellow-600 bg-yellow-50 border-yellow-200",
    colorTheme: "yellow"
  },
  {
    id: "rest-subway",
    category: "restaurant",
    title: "Subway Fresh Combo Offer",
    discount: "Flat 15% OFF",
    code: "SUB15",
    expiry: "30 Sep 2026",
    desc: "Customize your healthy subs, salads, and cookies with absolute fresh greens.",
    minOrder: 40,
    iconName: "store",
    accentColor: "text-green-600 bg-green-50 border-green-200",
    colorTheme: "green"
  },
  // 4. COUPON CARDS
  {
    id: "coup-welcome",
    category: "coupon",
    title: "First Order Special",
    discount: "50% OFF (No cap)",
    code: "WELCOME50",
    expiry: "31 Dec 2026",
    desc: "Welcome to QuikaBite! Unrestricted 50% discount on your first culinary journey.",
    minOrder: 0,
    iconName: "ticket",
    accentColor: "text-purple-600 bg-purple-50 border-purple-200",
    colorTheme: "purple"
  },
  {
    id: "coup-food40",
    category: "coupon",
    title: "Mega Gourmand Feast",
    discount: "40% OFF (Up to ₹ 50)",
    code: "FOOD40",
    expiry: "31 Dec 2026",
    desc: "Order high-end premium catering or large family platters. Minimum order ₹ 100.",
    minOrder: 100,
    iconName: "ticket",
    accentColor: "text-indigo-600 bg-indigo-50 border-indigo-200",
    colorTheme: "indigo"
  },
  {
    id: "coup-save10",
    category: "coupon",
    title: "Flat Quick Coupon",
    discount: "Flat ₹ 10 OFF",
    code: "SAVE10",
    expiry: "31 Dec 2026",
    desc: "Instantly save a flat ten on busy office lunches. Minimum order ₹ 40.",
    minOrder: 40,
    iconName: "ticket",
    accentColor: "text-pink-600 bg-pink-50 border-pink-200",
    colorTheme: "pink"
  },
  {
    id: "coup-freedel",
    category: "coupon",
    title: "Zero Delivery Fee",
    discount: "Free Delivery",
    code: "FREEDEL",
    expiry: "30 Nov 2026",
    desc: "Eliminate standard delivery fee from any restaurant. Minimum order ₹ 39.",
    minOrder: 39,
    iconName: "ticket",
    accentColor: "text-teal-600 bg-teal-50 border-teal-200",
    colorTheme: "teal"
  },
  // 5. CASHBACK OFFERS
  {
    id: "cash-back-15",
    category: "cashback",
    title: "Instant Premium Wallet Credit",
    discount: "15% Cashback (Up to ₹ 15)",
    code: "CASHBACK15",
    expiry: "12 Dec 2026",
    desc: "Get fifteen percent of your order amount back in your account wallet instantly. Min order ₹ 40.",
    minOrder: 40,
    iconName: "wallet",
    accentColor: "text-fuchsia-600 bg-fuchsia-50 border-fuchsia-200",
    colorTheme: "fuchsia"
  },
  {
    id: "cash-back-10",
    category: "cashback",
    title: "Double Treat Promo",
    discount: "Flat ₹ 10 Cashback",
    code: "CASHBACK10",
    expiry: "05 Oct 2026",
    desc: "Earn a guaranteed flat ₹ 10 cashback directly to your loyalty wallet. Min order ₹ 30.",
    minOrder: 30,
    iconName: "wallet",
    accentColor: "text-violet-600 bg-violet-50 border-violet-200",
    colorTheme: "violet"
  }
];
const getStoredOffers = () => {
  const localSaved = localStorage.getItem("globaleats_detailed_offers");
  if (localSaved) {
    try {
      return JSON.parse(localSaved);
    } catch {
      // Ignore JSON parse errors
    }
  }
  return INITIAL_DETAILED_OFFERS;
};
export let DETAILED_OFFERS = getStoredOffers();
export const saveOffersToStorage = (updatedList) => {
  DETAILED_OFFERS.length = 0;
  DETAILED_OFFERS.push(...updatedList);
  localStorage.setItem("globaleats_detailed_offers", JSON.stringify(updatedList));
};

export const EXTRA_KITCHENS = [
  {
    id: "truffle-co",
    name: "The Truffle Co.",
    rating: 4.8,
    reviewsCount: 140,
    cuisines: ["Italian", "Pasta", "Truffles"],
    deliveryTime: "30-35 mins",
    deliveryFee: 45,
    image:
      "https://images.unsplash.com/photo-1546549032-9571cd6b27df?auto=format&fit=crop&q=80&w=800",
    discount: "20% OFF",
    isPromoBadge: true,
    address: "Safa Park, Jumeirah 3",
    coordinates: { x: 38, y: 52 },
    menu: [
      {
        id: "tc-1",
        name: "Creamy Black Truffle Fettuccine",
        price: 58,
        description:
          "Artisanal fettuccine tossed in a rich, velvety butter-truffle cream sauce, shaved fresh black summer truffles, and aged Parmigiano-Reggiano.",
        image:
          "https://images.unsplash.com/photo-1645112411341-6c4fd023714a?auto=format&fit=crop&q=80&w=400",
        isVeg: true,
        isBestseller: true,
        category: "Italian",
      },
      {
        id: "tc-2",
        name: "Truffle Mushroom Artisan Pizza",
        price: 64,
        description:
          "Stone-baked Neapolitan pizza topped with porcini paste, wild mushrooms, truffle oil, fior di latte, and fresh thyme.",
        image:
          "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=400",
        isVeg: true,
        isBestseller: false,
        category: "Italian",
      },
      {
        id: "tc-3",
        name: "Truffle Mac & Cheese",
        price: 42,
        description:
          "Gourmet macaroni tossed in a velvety four-cheese truffle sauce, toasted panko crust.",
        image:
          "https://images.unsplash.com/photo-1546549032-9571cd6b27df?auto=format&fit=crop&q=80&w=400",
        isVeg: true,
        category: "Italian",
      },
      {
        id: "tc-4",
        name: "Truffle Fries",
        price: 22,
        description:
          "Hand-cut golden skin-on fries tossed in pure black truffle oil and freshly grated parmesan.",
        image:
          "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&q=80&w=400",
        isVeg: true,
        category: "Italian",
      },
      {
        id: "tc-5",
        name: "Truffle Risotto",
        price: 52,
        description:
          "Creamy Arborio rice slowly simmered with porcini stock, truffle butter, and fresh herbs.",
        image:
          "https://images.unsplash.com/photo-1546549032-9571cd6b27df?auto=format&fit=crop&q=80&w=400",
        isVeg: true,
        category: "Italian",
      },
      {
        id: "tc-6",
        name: "Truffle Burrata",
        price: 38,
        description:
          "Fresh creamy burrata cheese served over heirloom cherry tomatoes, wild arugula, and premium truffle glaze.",
        image:
          "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=400",
        isVeg: true,
        category: "Italian",
      },
      {
        id: "tc-7",
        name: "Shaved Truffle Garlic Bread",
        price: 16,
        description:
          "Baked artisan bread rubbed with garlic-truffle butter, melted mozzarella, and fresh parsley.",
        image:
          "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&q=80&w=400",
        isVeg: true,
        category: "Italian",
      },
      {
        id: "tc-8",
        name: "Truffle Honey Glazed Salmon",
        price: 62,
        description:
          "Pan-seared Atlantic salmon fillet glazed with premium raw truffle honey, served with asparagus.",
        image:
          "https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&q=80&w=400",
        isVeg: false,
        category: "Italian",
      },
      {
        id: "tc-9",
        name: "Truffle Gnocchi",
        price: 48,
        description:
          "Pillowy potato gnocchi tossed in creamy truffle Gorgonzola sauce and roasted hazelnuts.",
        image:
          "https://images.unsplash.com/photo-1546549032-9571cd6b27df?auto=format&fit=crop&q=80&w=400",
        isVeg: true,
        category: "Italian",
      },
      {
        id: "tc-10",
        name: "Wagyu Truffle Sliders",
        price: 54,
        description:
          "Two mini prime Wagyu beef patties with melted Gruyère, caramelized onions, and black truffle aioli.",
        image:
          "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=400",
        isVeg: false,
        category: "Italian",
      },
      {
        id: "tc-11",
        name: "Warm Truffle Chocolate Fondant",
        price: 28,
        description:
          "Rich chocolate lava cake infused with a hint of white truffle essence, served with vanilla bean gelato.",
        image:
          "https://images.unsplash.com/photo-1587314168485-3236d6710814?auto=format&fit=crop&q=80&w=400",
        isVeg: true,
        category: "Italian",
      },
    ],
  },
  {
    id: "waffle-wonderland",
    name: "Waffle Wonderland",
    rating: 4.7,
    reviewsCount: 320,
    cuisines: ["Desserts", "Waffles", "Crepes"],
    deliveryTime: "15-20 mins",
    deliveryFee: 0,
    image:
      "https://images.unsplash.com/photo-1562376502-6f769499c886?auto=format&fit=crop&q=80&w=800",
    discount: "Buy 1 Get 1",
    isPromoBadge: true,
    address: "Kite Beach, Jumeirah 5",
    coordinates: { x: 55, y: 48 },
    menu: [
      {
        id: "ww-1",
        name: "Belgian Chocolate Loaded Waffle",
        price: 24,
        description:
          "Fresh golden Belgian waffle drizzled with warm milk chocolate, dark chocolate curls, and freshly whipped cream.",
        image:
          "https://images.unsplash.com/photo-1562376502-6f769499c886?auto=format&fit=crop&q=80&w=400",
        isVeg: true,
        isBestseller: true,
        category: "Desserts",
      },
      {
        id: "ww-2",
        name: "Nutella Strawberry Crepe",
        price: 22,
        description:
          "Thin classic French crepe loaded with rich Nutella hazelnut spread and fresh sliced garden strawberries.",
        image:
          "https://images.unsplash.com/photo-1519676867240-f03562e64548?auto=format&fit=crop&q=80&w=400",
        isVeg: true,
        category: "Desserts",
      },
      {
        id: "ww-3",
        name: "Lotus Biscoff Overload Waffle",
        price: 26,
        description:
          "Fresh golden waffle smothered in melted Lotus cookie butter, crushed Biscoff crumbs, and soft vanilla ice cream.",
        image:
          "https://images.unsplash.com/photo-1562376502-6f769499c886?auto=format&fit=crop&q=80&w=400",
        isVeg: true,
        category: "Desserts",
      },
      {
        id: "ww-4",
        name: "Classic Maple & Butter Waffle",
        price: 18,
        description:
          "Traditional Belgian waffle served warm with 100% pure organic Canadian maple syrup and salted cream butter.",
        image:
          "https://images.unsplash.com/photo-1562376502-6f769499c886?auto=format&fit=crop&q=80&w=400",
        isVeg: true,
        category: "Desserts",
      },
      {
        id: "ww-5",
        name: "White Chocolate Raspberry Crepe",
        price: 24,
        description:
          "Thin crepe folded with premium white chocolate ganache, fresh organic raspberries, and raspberry coulis.",
        image:
          "https://images.unsplash.com/photo-1519676867240-f03562e64548?auto=format&fit=crop&q=80&w=400",
        isVeg: true,
        category: "Desserts",
      },
      {
        id: "ww-6",
        name: "Red Velvet Dream Waffle",
        price: 28,
        description:
          "Stunning crimson-colored waffle drizzled with warm sweet cream cheese glaze and red velvet cake crumbs.",
        image:
          "https://images.unsplash.com/photo-1562376502-6f769499c886?auto=format&fit=crop&q=80&w=400",
        isVeg: true,
        category: "Desserts",
      },
      {
        id: "ww-7",
        name: "Banoffee Caramel Crepe",
        price: 23,
        description:
          "Crepe filled with fresh banana slices, house salted caramel sauce, crushed digestive biscuits, and whipped cream.",
        image:
          "https://images.unsplash.com/photo-1519676867240-f03562e64548?auto=format&fit=crop&q=80&w=400",
        isVeg: true,
        category: "Desserts",
      },
      {
        id: "ww-8",
        name: "Double Chocolate Fudge Crepe",
        price: 25,
        description:
          "Fudge-filled crepe drizzled with both milk and dark Belgian chocolates, topped with chocolate pearls.",
        image:
          "https://images.unsplash.com/photo-1519676867240-f03562e64548?auto=format&fit=crop&q=80&w=400",
        isVeg: true,
        category: "Desserts",
      },
      {
        id: "ww-9",
        name: "Peanut Butter Banana Waffle",
        price: 22,
        description:
          "Waffle spread with creamy peanut butter, fresh banana slices, and toasted almond flakes.",
        image:
          "https://images.unsplash.com/photo-1562376502-6f769499c886?auto=format&fit=crop&q=80&w=400",
        isVeg: true,
        category: "Desserts",
      },
      {
        id: "ww-10",
        name: "Blueberry Lemon Custard Waffle",
        price: 24,
        description:
          "Warm waffle topped with fresh lemon curd, sweet blueberry compote, and dust of powdered sugar.",
        image:
          "https://images.unsplash.com/photo-1562376502-6f769499c886?auto=format&fit=crop&q=80&w=400",
        isVeg: true,
        category: "Desserts",
      },
      {
        id: "ww-11",
        name: "Signature Sundae Waffle Boat",
        price: 32,
        description:
          "Double waffle boat loaded with three scoops of premium ice cream, mixed berries, brownie bits, and chocolate syrup.",
        image:
          "https://images.unsplash.com/photo-1562376502-6f769499c886?auto=format&fit=crop&q=80&w=400",
        isVeg: true,
        category: "Desserts",
      },
    ],
  },
  {
    id: "noodle-craft",
    name: "Noodle Craft",
    rating: 4.5,
    reviewsCount: 410,
    cuisines: ["Chinese", "Ramen", "Japanese"],
    deliveryTime: "25-30 mins",
    deliveryFee: 30,
    image:
      "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&q=80&w=800",
    discount: "10% OFF",
    isPromoBadge: false,
    address: "Business Bay, Dubai",
    coordinates: { x: 40, y: 38 },
    menu: [
      {
        id: "nc-1",
        name: "Shoyu Chashu Ramen",
        price: 45,
        description:
          "Slow-simmered chicken and soy broth, hand-crafted ramen noodles, tender braised chicken chashu, soft-boiled marinated egg, nori, and scallions.",
        image:
          "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&q=80&w=400",
        isVeg: false,
        isBestseller: true,
        category: "Chinese",
      },
      {
        id: "nc-2",
        name: "Steamed Chicken Gyoza (6 pcs)",
        price: 26,
        description:
          "Delectable Japanese dumplings filled with minced chicken and ginger, steamed and served with a vinegar-soy dipping sauce.",
        image:
          "https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&q=80&w=400",
        isVeg: false,
        category: "Chinese",
      },
      {
        id: "nc-3",
        name: "Spicy Tan Tan Ramen",
        price: 48,
        description:
          "Rich spicy sesame-peanut pork broth, ramen noodles, minced seasoned chicken, pak choy, and chili oil.",
        image:
          "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&q=80&w=400",
        isVeg: false,
        category: "Chinese",
      },
      {
        id: "nc-4",
        name: "Vegetarian Miso Ramen",
        price: 38,
        description:
          "Earthy miso broth, soft hand-crafted noodles, grilled silken tofu, wood-ear mushrooms, bamboo shoots, and sweet corn.",
        image:
          "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&q=80&w=400",
        isVeg: true,
        category: "Healthy",
      },
      {
        id: "nc-5",
        name: "Beef Dan Dan Stir-Fried Noodles",
        price: 42,
        description:
          "Wok-tossed ramen noodles with ground spicy beef, preserved vegetables, and house chili peanut sauce.",
        image:
          "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&q=80&w=400",
        isVeg: false,
        category: "Chinese",
      },
      {
        id: "nc-6",
        name: "Crispy Vegetable Tempura",
        price: 22,
        description:
          "Assorted seasonal vegetables coated in light and airy Japanese tempura batter, served with tentsuyu dip.",
        image:
          "https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&q=80&w=400",
        isVeg: true,
        category: "Chinese",
      },
      {
        id: "nc-7",
        name: "Teriyaki Salmon Rice Bowl",
        price: 52,
        description:
          "Pan-roasted Atlantic salmon glazed with sweet teriyaki, served over sticky rice and steamed broccoli.",
        image:
          "https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&q=80&w=400",
        isVeg: false,
        category: "Healthy",
      },
      {
        id: "nc-8",
        name: "Spicy Kimchi Fried Rice",
        price: 32,
        description:
          "Spicy wok fried rice with aged house kimchi, scallions, sesame, topped with a fried sunny-side-up egg.",
        image:
          "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&q=80&w=400",
        isVeg: true,
        category: "Chinese",
      },
      {
        id: "nc-9",
        name: "Chicken Katsu Curry",
        price: 44,
        description:
          "Golden-crispy panko breaded chicken breast served with aromatic Japanese curry sauce and steamed rice.",
        image:
          "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&q=80&w=400",
        isVeg: false,
        category: "Chinese",
      },
      {
        id: "nc-10",
        name: "Edamame with Sea Salt",
        price: 14,
        description:
          "Steated green soybean pods sprinkled with Maldon sea salt flakes.",
        image:
          "https://images.unsplash.com/photo-1613478223719-2ab802602423?auto=format&fit=crop&q=80&w=400",
        isVeg: true,
        category: "Healthy",
      },
      {
        id: "nc-11",
        name: "Matcha Green Tea Ice Cream",
        price: 16,
        description:
          "Two scoops of authentic premium Japanese matcha green tea ice cream.",
        image:
          "https://images.unsplash.com/photo-1587314168485-3236d6710814?auto=format&fit=crop&q=80&w=400",
        isVeg: true,
        category: "Desserts",
      },
    ],
  },
  {
    id: "sichuan-tavern",
    name: "Spicy Sichuan Tavern",
    rating: 4.6,
    reviewsCount: 180,
    cuisines: ["Sichuan", "Chinese", "Spicy"],
    deliveryTime: "20-25 mins",
    deliveryFee: 35,
    image:
      "https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&q=80&w=800",
    discount: "Free Gyoza",
    isPromoBadge: true,
    address: "Al Karama, Dubai",
    coordinates: { x: 30, y: 30 },
    menu: [
      {
        id: "st-1",
        name: "Fiery Mapo Tofu",
        price: 32,
        description:
          "Silken tofu chunks cooked in a spicy, numbing Sichuan peppercorn and fermented broad bean paste sauce, sprinkled with scallions.",
        image:
          "https://images.unsplash.com/photo-1541832676-9b763b0239ab?auto=format&fit=crop&q=80&w=400",
        isVeg: true,
        isBestseller: true,
        category: "Chinese",
      },
      {
        id: "st-2",
        name: "Sichuan Dan Dan Noodles",
        price: 34,
        description:
          "Noodles tossed in a spicy, savory sesame sauce with minced chicken, preserved vegetables, and toasted peanuts.",
        image:
          "https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&q=80&w=400",
        isVeg: false,
        category: "Chinese",
      },
      {
        id: "st-3",
        name: "Spicy Kung Pao Chicken",
        price: 38,
        description:
          "Wok-fried chicken cubes with dry red chilies, spring onions, capsicum, and roasted peanuts in sweet-spicy glaze.",
        image:
          "https://images.unsplash.com/photo-1525755662778-989d0524087e?auto=format&fit=crop&q=80&w=400",
        isVeg: false,
        category: "Chinese",
      },
      {
        id: "st-4",
        name: "Sichuan Chilli Oil Dumplings (8 pcs)",
        price: 28,
        description:
          "Steamed chicken dumplings bathed in an incredibly aromatic house-made sweet chili oil and black vinegar.",
        image:
          "https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&q=80&w=400",
        isVeg: false,
        category: "Chinese",
      },
      {
        id: "st-5",
        name: "Dry-Fried Green Beans",
        price: 24,
        description:
          "Blistered fresh string beans stir-fried with garlic, ginger, and spicy Sichuan preserved mustard greens.",
        image:
          "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=400",
        isVeg: true,
        category: "Healthy",
      },
      {
        id: "st-6",
        name: "Spicy Cumin Lamb",
        price: 48,
        description:
          "Tender sliced lamb stir-fried at high heat with lots of toasted cumin, dried chilies, onions, and cilantro.",
        image:
          "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&q=80&w=400",
        isVeg: false,
        category: "Chinese",
      },
      {
        id: "st-7",
        name: "Hot and Numbing Beef Hotpot",
        price: 56,
        description:
          "Slices of tender beef simmered in an aromatic, fiery broth with bean sprouts, mushrooms, and glass noodles.",
        image:
          "https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&q=80&w=400",
        isVeg: false,
        category: "Chinese",
      },
      {
        id: "st-8",
        name: "Smashed Cucumber Salad",
        price: 16,
        description:
          "Crisp English cucumbers smashed and tossed with minced garlic, soy sauce, black vinegar, and red chili oil.",
        image:
          "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=400",
        isVeg: true,
        category: "Healthy",
      },
      {
        id: "st-9",
        name: "Eggplant in Garlic Sauce",
        price: 26,
        description:
          "Soft Chinese eggplant braised in a sweet, sour, savory, and spicy garlic sauce with spring onions.",
        image:
          "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=400",
        isVeg: true,
        category: "Chinese",
      },
      {
        id: "st-10",
        name: "Wok-Tossed Cabbage with Chilies",
        price: 18,
        description:
          "Sweet flat cabbage leaves torn and quick-fired with dried red lantern chilies and Sichuan pepper oil.",
        image:
          "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=400",
        isVeg: true,
        category: "Chinese",
      },
      {
        id: "st-11",
        name: "Brown Sugar Rice Cake",
        price: 14,
        description:
          "Traditional chewy fried rice cakes drizzled with hot sweet brown sugar syrup, a perfect cooling finish.",
        image:
          "https://images.unsplash.com/photo-1587314168485-3236d6710814?auto=format&fit=crop&q=80&w=400",
        isVeg: true,
        category: "Desserts",
      },
    ],
  },
];

export const INITIAL_NOTIFICATIONS = [
  {
    id: "n1",
    category: "offers",
    title: "50% Gourmet Discount Active 🏷️",
    message:
      "Get 50% off on your next feast with coupon GOURMET50. Valid for the next 2 hours only!",
    timestamp: "10 mins ago",
    isRead: false,
    discountCode: "GOURMET50",
  },
  {
    id: "n2",
    category: "orders",
    title: "Your order has been delivered! 🎉",
    message:
      "Your deluxe feast from Royal Biryani Hub was successfully delivered. Enjoy your hot meals!",
    timestamp: "2 hours ago",
    isRead: true,
  },
  {
    id: "n3",
    category: "wallet",
    title: "₹ 30 Cashback Credited! 💳",
    message:
      "You have earned ₹ 30 cashback from completing the Weekend Culinary Challenge. Added to wallet!",
    timestamp: "1 day ago",
    isRead: false,
    amount: "₹ 30",
  },
  {
    id: "n4",
    category: "promotions",
    title: "Midnight Feasts Released! 🌙",
    message:
      "Craving late-night snacks? 25+ local partners are now cooking 24/7 with zero delivery fees after midnight.",
    timestamp: "2 days ago",
    isRead: true,
  },
];

