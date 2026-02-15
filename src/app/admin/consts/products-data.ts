import { Product } from 'src/app/products/types/product.types';
import { imgs, withStock } from '../helpers/stock-helpers';
import { Store } from 'src/app/stores/types/store.types';

// ─── Image pools (Unsplash running shoe photos) ────────────────────
// Grouped by rough category so products get relevant-looking images.

export const ROAD_IMGS = [
	'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&h=600&fit=crop', // red Nike
	'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=600&h=600&fit=crop', // white running shoe
	'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=600&h=600&fit=crop', // colorful Nike
	'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=600&h=600&fit=crop', // white sneaker
	'https://images.unsplash.com/photo-1539185441755-769473a23570?w=600&h=600&fit=crop', // orange Nike
	'https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=600&h=600&fit=crop', // white Nike side
	'https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?w=600&h=600&fit=crop', // green Nike
	'https://images.unsplash.com/photo-1584735175315-9d5df23860e6?w=600&h=600&fit=crop', // black running shoe
	'https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=600&h=600&fit=crop', // colorful sneaker
	'https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?w=600&h=600&fit=crop', // blue Nike React
];

export const TRAIL_IMGS = [
	'https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?w=600&h=600&fit=crop', // trail shoe on rock
	'https://images.unsplash.com/photo-1520256862855-398228c41684?w=600&h=600&fit=crop', // trail runner feet
	'https://images.unsplash.com/photo-1605348532760-6753d2c43329?w=600&h=600&fit=crop', // hiking shoe
	'https://images.unsplash.com/photo-1519861531473-9200262188bf?w=600&h=600&fit=crop', // outdoor shoe
	'https://images.unsplash.com/photo-1575537302964-96cd47c06b1b?w=600&h=600&fit=crop', // trail running
	'https://images.unsplash.com/photo-1511556532299-8f662fc26c06?w=600&h=600&fit=crop', // rugged shoe
];

export const RACE_IMGS = [
	'https://images.unsplash.com/photo-1597045566677-8cf032ed6634?w=600&h=600&fit=crop', // neon racing flat
	'https://images.unsplash.com/photo-1552346154-21d32810aba3?w=600&h=600&fit=crop', // bright running shoe
	'https://images.unsplash.com/photo-1562183241-b937e95585b6?w=600&h=600&fit=crop', // racing shoe pair
	'https://images.unsplash.com/photo-1556906781-9a412961c28c?w=600&h=600&fit=crop', // vivid sneaker
];

// ─── Seed products (20) ─────────────────────────────────────────────
export const SEED_PRODUCTS: Product[] = [
	// ── NIKE (4) ──────────────────────────────────────────────────────
	{
		id: 1,
		companyName: 'NIKE',
		name: 'Nike Pegasus 41',
		modelNo: 'NK-PG41-001',
		category: ['Running'],
		subCategory: ['Road Running'],
		price: 139.9,
		discount: 15,
		rating: 4.6,
		reviews: 312,
		description:
			'The Nike Pegasus 41 delivers a smooth, responsive ride with ReactX foam and a redesigned Air Zoom unit. Engineered mesh upper for breathability on every run.',
		variants: [
			{
				variantId: 'PG41-001',
				imageList: imgs(ROAD_IMGS, 0, 3),
				sizes: [36, 37, 38, 39, 40, 41, 42, 43, 44, 45],
				inStock: [4, 6, 10, 12, 15, 13, 10, 8, 5, 3],
			},
			{
				variantId: 'PG41-100',
				imageList: imgs(ROAD_IMGS, 3, 2),
				sizes: [36, 37, 38, 39, 40, 41, 42, 43, 44, 45],
				inStock: [3, 5, 8, 10, 12, 10, 8, 6, 4, 2],
			},
		],
		imageList: imgs(ROAD_IMGS, 0, 2),
	},
	{
		id: 2,
		companyName: 'NIKE',
		name: 'Nike Vomero 18',
		modelNo: 'NK-VM18-400',
		category: ['Running'],
		subCategory: ['Road Running'],
		price: 159.9,
		discount: 10,
		rating: 4.5,
		reviews: 198,
		description:
			'Maximum cushioning for long-distance comfort. The Vomero 18 features ZoomX foam and a plush Flyknit collar for a luxurious ride mile after mile.',
		variants: [
			{
				variantId: 'VM18-400',
				imageList: imgs(ROAD_IMGS, 5, 3),
				sizes: [37, 38, 39, 40, 41, 42, 43, 44, 45],
				inStock: [3, 5, 8, 11, 13, 10, 7, 5, 2],
			},
		],
		imageList: imgs(ROAD_IMGS, 5, 2),
	},
	{
		id: 3,
		companyName: 'NIKE',
		name: 'Nike Wildhorse 8',
		modelNo: 'NK-WH8-300',
		category: ['Trail Running'],
		subCategory: ['All-Terrain'],
		price: 119.9,
		discount: 20,
		rating: 4.4,
		reviews: 167,
		description:
			'Built to handle technical trails with aggressive lugs and a rock plate. React foam keeps it comfortable on long off-road adventures.',
		variants: [
			{
				variantId: 'WH8-300',
				imageList: imgs(TRAIL_IMGS, 0, 3),
				sizes: [36, 37, 38, 39, 40, 41, 42, 43, 44],
				inStock: [2, 4, 7, 9, 11, 9, 7, 4, 2],
			},
		],
		imageList: imgs(TRAIL_IMGS, 0, 2),
	},
	{
		id: 4,
		companyName: 'NIKE',
		name: 'Nike Alphafly 3',
		modelNo: 'NK-AF3-700',
		category: ['Racing'],
		subCategory: ['Competition'],
		price: 274.9,
		discount: 0,
		rating: 4.9,
		reviews: 89,
		description:
			'The ultimate marathon racing shoe. Full-length carbon fibre plate, dual Air Zoom pods and ZoomX foam for record-breaking speed.',
		variants: [
			{
				variantId: 'AF3-700',
				imageList: imgs(RACE_IMGS, 0, 3),
				sizes: [38, 39, 40, 41, 42, 43, 44, 45],
				inStock: [1, 2, 3, 4, 4, 3, 2, 1],
			},
		],
		imageList: imgs(RACE_IMGS, 0, 2),
	},

	// ── ADIDAS (3) ────────────────────────────────────────────────────
	{
		id: 5,
		companyName: 'ADIDAS',
		name: 'Adidas Ultraboost Light',
		modelNo: 'AD-UBL-GY9351',
		category: ['Running'],
		subCategory: ['Road Running'],
		price: 189.9,
		discount: 15,
		rating: 4.7,
		reviews: 245,
		description:
			'30% lighter BOOST midsole for an energised ride without the weight. Primeknit+ upper adapts to your foot for a glove-like fit.',
		variants: [
			{
				variantId: 'UBL-GY9351',
				imageList: imgs(ROAD_IMGS, 8, 3),
				sizes: [36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46],
				inStock: [3, 5, 8, 12, 14, 12, 10, 8, 5, 3, 1],
			},
		],
		imageList: imgs(ROAD_IMGS, 8, 2),
	},
	{
		id: 6,
		companyName: 'ADIDAS',
		name: 'Adidas Supernova Rise',
		modelNo: 'AD-SNR-IG5844',
		category: ['Running'],
		subCategory: ['Road Running'],
		price: 119.9,
		discount: 20,
		rating: 4.3,
		reviews: 178,
		description:
			'Dreamstrike+ cushioning and a supportive heel counter make the Supernova Rise ideal for daily training runs. Comfortable from the first step.',
		variants: [
			{
				variantId: 'SNR-IG5844',
				imageList: imgs(ROAD_IMGS, 1, 2),
				sizes: [36, 37, 38, 39, 40, 41, 42, 43, 44, 45],
				inStock: [5, 7, 10, 14, 16, 14, 11, 8, 5, 3],
			},
		],
		imageList: imgs(ROAD_IMGS, 1, 2),
	},
	{
		id: 7,
		companyName: 'ADIDAS',
		name: 'Adidas Terrex Speed Ultra',
		modelNo: 'AD-TSU-FY7639',
		category: ['Trail Running'],
		subCategory: ['All-Terrain'],
		price: 169.9,
		discount: 10,
		rating: 4.5,
		reviews: 92,
		description:
			'Lightweight and fast on the trail. Lightstrike Pro midsole and Continental rubber outsole deliver speed and grip on technical terrain.',
		variants: [
			{
				variantId: 'TSU-FY7639',
				imageList: imgs(TRAIL_IMGS, 2, 3),
				sizes: [37, 38, 39, 40, 41, 42, 43, 44, 45],
				inStock: [2, 4, 6, 8, 9, 7, 5, 3, 1],
			},
		],
		imageList: imgs(TRAIL_IMGS, 2, 2),
	},

	// ── NEW BALANCE (2) ───────────────────────────────────────────────
	{
		id: 8,
		companyName: 'NEW BALANCE',
		name: 'New Balance Fresh Foam 1080v13',
		modelNo: 'NB-1080-M1080V13',
		category: ['Running'],
		subCategory: ['Road Running'],
		price: 159.9,
		discount: 10,
		rating: 4.7,
		reviews: 287,
		description:
			'Premium cushioning for everyday runs. Fresh Foam X midsole and Hypoknit upper combine plush comfort with a secure, adaptive fit.',
		variants: [
			{
				variantId: '1080V13-BLK',
				imageList: imgs(ROAD_IMGS, 7, 3),
				sizes: [37, 38, 39, 40, 41, 42, 43, 44, 45],
				inStock: [4, 6, 9, 12, 14, 11, 8, 5, 3],
			},
			{
				variantId: '1080V13-WHT',
				imageList: imgs(ROAD_IMGS, 3, 2),
				sizes: [37, 38, 39, 40, 41, 42, 43, 44, 45],
				inStock: [3, 5, 7, 10, 11, 9, 6, 4, 2],
			},
		],
		imageList: imgs(ROAD_IMGS, 7, 2),
	},
	{
		id: 9,
		companyName: 'NEW BALANCE',
		name: 'New Balance FuelCell Rebel v4',
		modelNo: 'NB-REBEL-MFCXV4',
		category: ['Running'],
		subCategory: ['Training'],
		price: 139.9,
		discount: 15,
		rating: 4.6,
		reviews: 164,
		description:
			'Snappy and lightweight for tempo runs and speed sessions. FuelCell midsole with a propulsive feel and breathable mesh upper.',
		variants: [
			{
				variantId: 'REBEL4-NVY',
				imageList: imgs(ROAD_IMGS, 9, 2),
				sizes: [37, 38, 39, 40, 41, 42, 43, 44],
				inStock: [3, 5, 8, 10, 12, 9, 6, 3],
			},
		],
		imageList: imgs(ROAD_IMGS, 9, 2),
	},

	// ── ASICS (3) ─────────────────────────────────────────────────────
	{
		id: 10,
		companyName: 'ASICS',
		name: 'Asics Gel-Nimbus 26',
		modelNo: 'AS-NIM26-1011B794',
		category: ['Running'],
		subCategory: ['Road Running'],
		price: 179.9,
		discount: 10,
		rating: 4.8,
		reviews: 340,
		description:
			'The softest Nimbus ever. PureGEL technology and FF BLAST PLUS ECO cushioning deliver an incredibly plush, cloud-like ride for neutral runners.',
		variants: [
			{
				variantId: 'NIM26-001',
				imageList: imgs(ROAD_IMGS, 4, 3),
				sizes: [36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46],
				inStock: [4, 6, 10, 14, 16, 14, 11, 8, 6, 3, 1],
			},
		],
		imageList: imgs(ROAD_IMGS, 4, 2),
	},
	{
		id: 11,
		companyName: 'ASICS',
		name: 'Asics Gel-Kayano 31',
		modelNo: 'AS-KAY31-1011B867',
		category: ['Running'],
		subCategory: ['Road Running'],
		price: 189.9,
		discount: 5,
		rating: 4.7,
		reviews: 256,
		description:
			'Stability meets comfort. The Kayano 31 features 4D Guidance System and FF BLAST PLUS cushioning for support without sacrificing a smooth ride.',
		variants: [
			{
				variantId: 'KAY31-400',
				imageList: imgs(ROAD_IMGS, 6, 2),
				sizes: [37, 38, 39, 40, 41, 42, 43, 44, 45],
				inStock: [3, 5, 8, 11, 13, 10, 7, 5, 2],
			},
		],
		imageList: imgs(ROAD_IMGS, 6, 2),
	},
	{
		id: 12,
		companyName: 'ASICS',
		name: 'Asics Trabuco Max 3',
		modelNo: 'AS-TRB3-1011B800',
		category: ['Trail Running'],
		subCategory: ['All-Terrain'],
		price: 159.9,
		discount: 15,
		rating: 4.5,
		reviews: 103,
		description:
			'Maximum cushioning for ultra-distance trails. FF BLAST PLUS midsole and ASICSGRIP outsole handle mud, rock and everything in between.',
		variants: [
			{
				variantId: 'TRB3-300',
				imageList: imgs(TRAIL_IMGS, 4, 3),
				sizes: [37, 38, 39, 40, 41, 42, 43, 44],
				inStock: [2, 3, 6, 8, 9, 7, 4, 2],
			},
		],
		imageList: imgs(TRAIL_IMGS, 4, 2),
	},

	// ── HOKA (3) ──────────────────────────────────────────────────────
	{
		id: 13,
		companyName: 'HOKA',
		name: 'Hoka Clifton 9',
		modelNo: 'HK-CLF9-1127895',
		category: ['Running'],
		subCategory: ['Road Running'],
		price: 144.9,
		discount: 10,
		rating: 4.7,
		reviews: 410,
		description:
			'Impossibly light, impossibly cushioned. The Clifton 9 features a compression-moulded EVA midsole for a balanced, smooth ride on every run.',
		variants: [
			{
				variantId: 'CLF9-BBLC',
				imageList: imgs(ROAD_IMGS, 2, 3),
				sizes: [36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46],
				inStock: [5, 7, 11, 14, 18, 15, 12, 9, 6, 4, 2],
			},
			{
				variantId: 'CLF9-CSIL',
				imageList: imgs(ROAD_IMGS, 5, 2),
				sizes: [36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46],
				inStock: [3, 5, 8, 10, 13, 11, 9, 7, 4, 2, 1],
			},
		],
		imageList: imgs(ROAD_IMGS, 2, 2),
	},
	{
		id: 14,
		companyName: 'HOKA',
		name: 'Hoka Speedgoat 6',
		modelNo: 'HK-SPG6-1160354',
		category: ['Trail Running'],
		subCategory: ['All-Terrain'],
		price: 154.9,
		discount: 10,
		rating: 4.8,
		reviews: 225,
		description:
			'The go-to trail shoe. Vibram Megagrip outsole and CMEVA midsole deliver grip and comfort from mountain paths to muddy singletracks.',
		variants: [
			{
				variantId: 'SPG6-RYLB',
				imageList: imgs(TRAIL_IMGS, 1, 3),
				sizes: [37, 38, 39, 40, 41, 42, 43, 44, 45],
				inStock: [3, 5, 7, 10, 12, 10, 7, 4, 2],
			},
		],
		imageList: imgs(TRAIL_IMGS, 1, 2),
	},
	{
		id: 15,
		companyName: 'HOKA',
		name: 'Hoka Rocket X 2',
		modelNo: 'HK-RX2-1127927',
		category: ['Racing'],
		subCategory: ['Competition'],
		price: 249.9,
		discount: 5,
		rating: 4.8,
		reviews: 78,
		description:
			'Carbon fibre plate racer with PEBA midsole. Built for 5K to marathon, delivering explosive energy return and a locked-in fit.',
		variants: [
			{
				variantId: 'RX2-CEPR',
				imageList: imgs(RACE_IMGS, 1, 2),
				sizes: [38, 39, 40, 41, 42, 43, 44, 45],
				inStock: [1, 2, 4, 5, 5, 3, 2, 1],
			},
		],
		imageList: imgs(RACE_IMGS, 1, 2),
	},

	// ── ON (2) ────────────────────────────────────────────────────────
	{
		id: 16,
		companyName: 'ON',
		name: 'On Cloudmonster 2',
		modelNo: 'ON-CM2-6198075',
		category: ['Running'],
		subCategory: ['Road Running'],
		price: 169.9,
		discount: 0,
		rating: 4.6,
		reviews: 189,
		description:
			'Maximum cushioning, zero gravity feeling. CloudTec Phase technology and Helion HF foam deliver a soft landing and explosive take-off.',
		variants: [
			{
				variantId: 'CM2-UNDYD',
				imageList: imgs(ROAD_IMGS, 0, 3),
				sizes: [37, 38, 39, 40, 41, 42, 43, 44, 45],
				inStock: [3, 5, 8, 10, 12, 10, 7, 4, 2],
			},
		],
		imageList: imgs(ROAD_IMGS, 0, 2),
	},
	{
		id: 17,
		companyName: 'ON',
		name: 'On Cloudsurfer 7',
		modelNo: 'ON-CS7-3MD10240',
		category: ['Running'],
		subCategory: ['Training'],
		price: 149.9,
		discount: 10,
		rating: 4.5,
		reviews: 142,
		description:
			'Versatile daily trainer with CloudTec cushioning and Speedboard energy transfer. A smooth, responsive ride for training and easy runs.',
		variants: [
			{
				variantId: 'CS7-BLK',
				imageList: imgs(ROAD_IMGS, 7, 2),
				sizes: [36, 37, 38, 39, 40, 41, 42, 43, 44, 45],
				inStock: [4, 6, 9, 12, 14, 12, 9, 6, 4, 2],
			},
		],
		imageList: imgs(ROAD_IMGS, 7, 2),
	},

	// ── BROOKS (2) ────────────────────────────────────────────────────
	{
		id: 18,
		companyName: 'BROOKS',
		name: 'Brooks Ghost 16',
		modelNo: 'BR-GH16-1104091D',
		category: ['Running'],
		subCategory: ['Road Running'],
		price: 139.9,
		discount: 15,
		rating: 4.6,
		reviews: 365,
		description:
			'Smooth and soft for every run. DNA LOFT v2 cushioning and a 3D Fit Print upper deliver a balanced, comfortable daily trainer experience.',
		variants: [
			{
				variantId: 'GH16-BLK',
				imageList: imgs(ROAD_IMGS, 4, 3),
				sizes: [36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46],
				inStock: [5, 7, 11, 15, 18, 15, 12, 9, 6, 4, 2],
			},
			{
				variantId: 'GH16-GRY',
				imageList: imgs(ROAD_IMGS, 9, 2),
				sizes: [36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46],
				inStock: [3, 5, 8, 11, 14, 12, 9, 7, 4, 2, 1],
			},
		],
		imageList: imgs(ROAD_IMGS, 4, 2),
	},
	{
		id: 19,
		companyName: 'BROOKS',
		name: 'Brooks Cascadia 18',
		modelNo: 'BR-CS18-1104091T',
		category: ['Trail Running'],
		subCategory: ['All-Terrain'],
		price: 149.9,
		discount: 10,
		rating: 4.5,
		reviews: 134,
		description:
			'Trail-tested durability with BioMoGo DNA cushioning and a rock plate. Pivotal lugs grip roots, rocks and loose surfaces with confidence.',
		variants: [
			{
				variantId: 'CS18-BLU',
				imageList: imgs(TRAIL_IMGS, 3, 3),
				sizes: [37, 38, 39, 40, 41, 42, 43, 44, 45],
				inStock: [2, 4, 7, 9, 11, 9, 6, 4, 2],
			},
		],
		imageList: imgs(TRAIL_IMGS, 3, 2),
	},

	// ── SAUCONY (1) ───────────────────────────────────────────────────
	{
		id: 20,
		companyName: 'SAUCONY',
		name: 'Saucony Endorphin Speed 4',
		modelNo: 'SC-ES4-S20940',
		category: ['Racing'],
		subCategory: ['Competition'],
		price: 169.9,
		discount: 10,
		rating: 4.7,
		reviews: 198,
		description:
			'Nylon plate racer for everyday speed. PWRRUN PB cushioning and SPEEDROLL technology propel you forward with less effort from 5K to marathon.',
		variants: [
			{
				variantId: 'ES4-VIZ',
				imageList: imgs(RACE_IMGS, 2, 3),
				sizes: [37, 38, 39, 40, 41, 42, 43, 44, 45],
				inStock: [2, 4, 6, 9, 11, 8, 6, 3, 1],
			},
		],
		imageList: imgs(RACE_IMGS, 2, 2),
	},
];

export const SEED_STORES: Omit<Store, 'id'>[] = [
	// ── Flagship ──
	{
		name: 'iRun Essen City',
		address: 'Kettwiger Straße 40, 45127 Essen',
		location: { lat: 51.4562, lng: 7.0131 },
		isDefaultStore: true,
		openingTime: { open: '09:00', close: '20:00' },
		description: 'Our flagship store in the heart of Essen city centre.',
		products: SEED_PRODUCTS.map((p) => withStock(p, 1)),
	},
	// ── Partial catalog, low stock ──
	{
		name: 'iRun Mülheim',
		address: 'Schloßstraße 28, 45468 Mülheim an der Ruhr',
		location: { lat: 51.4277, lng: 6.8825 },
		isDefaultStore: false,
		openingTime: { open: '10:00', close: '19:00' },
		description: 'Conveniently located near Mülheim city centre.',
		products: SEED_PRODUCTS.slice(0, 14).map((p) => withStock(p, 0.5)),
	},
	// ── All products, high stock ──
	{
		name: 'iRun Oberhausen CentrO',
		address: 'Centroallee 1000, 46047 Oberhausen',
		location: { lat: 51.4894, lng: 6.8789 },
		isDefaultStore: false,
		openingTime: { open: '10:00', close: '21:00' },
		description: "Find us in the CentrO shopping centre, one of Europe's largest.",
		products: SEED_PRODUCTS.map((p) => withStock(p, 1.5)),
	},
	// ── All products, medium stock ──
	{
		name: 'iRun Dortmund',
		address: 'Westenhellweg 102, 44137 Dortmund',
		location: { lat: 51.5136, lng: 7.4653 },
		isDefaultStore: false,
		openingTime: { open: '09:30', close: '20:00' },
		description: "Located on Dortmund's busiest shopping street in the city centre.",
		products: SEED_PRODUCTS.map((p) => withStock(p, 0.8)),
	},
	// ── All products, high stock ──
	{
		name: 'iRun Düsseldorf',
		address: 'Schadowstraße 54, 40212 Düsseldorf',
		location: { lat: 51.2277, lng: 6.7896 },
		isDefaultStore: false,
		openingTime: { open: '09:00', close: '20:00' },
		description: "Premium store on the Schadowstraße, Düsseldorf's top shopping mile.",
		products: SEED_PRODUCTS.map((p) => withStock(p, 1.3)),
	},
	// ── Partial catalog, medium stock ──
	{
		name: 'iRun Bochum',
		address: 'Kortumstraße 73, 44787 Bochum',
		location: { lat: 51.4818, lng: 7.2162 },
		isDefaultStore: false,
		openingTime: { open: '10:00', close: '19:00' },
		description: 'Right in the heart of Bochum, close to the Bermuda3eck.',
		products: SEED_PRODUCTS.slice(0, 16).map((p) => withStock(p, 0.7)),
	},
];
