const cars = [
    {
      "name": "Camry",
      "brand": "Toyota",
      "price": 30000,
      "category": "Sedan",
      "description": "A modern, reliable sedan.",
      "quantity": 10,
      "inStock": true,
      "image": "https://hips.hearstapps.com/hmg-prod/images/c-005-1500x1000-1652713137.jpg"
    },
    {
      "name": "F-150",
      "brand": "Ford",
      "price": 45000,
      "category": "Truck",
      "description": "America's favorite full-size pickup truck.",
      "quantity": 8,
      "inStock": true,
      "image": "https://hips.hearstapps.com/hmg-prod/images/2024-ford-f-150-lariat-exterior-101-64ff7459abf73.jpg?crop=0.793xw:0.771xh;0.135xw,0.188xh&resize=1200:*"
    },
    {
      "name": "Model 3",
      "brand": "Tesla",
      "price": 42000,
      "category": "Electric",
      "description": "An all-electric sedan with cutting-edge features.",
      "quantity": 5,
      "inStock": true,
      "image": "https://static0.carbuzzimages.com/wordpress/wp-content/uploads/2024/03/1218165-20.jpg?q=50&fit=crop&w=825&dpr=1.5"
    },
    {
      "name": "CX-5",
      "brand": "Mazda",
      "price": 31000,
      "category": "SUV",
      "description": "A stylish and sporty compact SUV.",
      "quantity": 7,
      "inStock": true,
      "image": "https://hips.hearstapps.com/hmg-prod/images/2025-mazda-cx-5-front-three-quarters-2-67a23acb1d56f.jpg?crop=0.587xw:0.567xh;0.343xw,0.374xh&resize=1200:*"
    },
    {
      "name": "Civic Type R",
      "brand": "Honda",
      "price": 43000,
      "category": "Sports",
      "description": "A high-performance version of the classic Civic.",
      "quantity": 4,
      "inStock": true,
      "image": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQR7UZcN_5wcMBUIekVMNNdX6uQnc1debdlAw&s"
    },
    {
      "name": "A6",
      "brand": "Audi",
      "price": 55000,
      "category": "Luxury",
      "description": "A sleek and sophisticated executive sedan.",
      "quantity": 3,
      "inStock": true,
      "image": "https://media.audi.com/is/image/audi/nemo/models/a6/a6-limousine/my-2024/stage/AA6_L_181012_3-L.jpg"
    }
  ]
  
const FeaturedCars = () => {
    return (
        <div className="container mx-auto py-8 my-10">
        <h2 className="text-center text-purple-700 text-4xl font-bold">Featured Cars</h2>
        <p className="text-center text-purple-700 text-xl font-semibold my-3">Explore our top picks across all categories – handpicked for performance, style, and value.</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
           {
            cars.map((car, index) => (
                <div key={index} className="flex flex-col  bg-white shadow-lg rounded-lg p-4 mb-4">
                    <img src={car.image} alt={car.name} className="w-full h-full rounded-lg" />
                    <div className="md:ml-4 mt-3">
                        <h3 className="text-xl font-bold">Model: <span className="text-purple-700 ">{car.name}</span></h3>
                        <p className="text-gray-900 font-semibold text-xl mt-2">Price: ${car.price}</p>
                        <div className="flex flex-col md:flex-row gap-2 md:gap-5 my-2">
                        <p className="text-gray-600 text-lg font-semibold">Category: <span className="rounded-lg p-1 border-2 border-purple-700 text-purple-500">{car.category}</span> </p>
                        <p className="text-gray-600 text-lg font-semibold">Brand:  <span className="text-purple-700 ">{car.brand}</span></p>
                        </div>
                    </div>
                </div>
            ))
           }
        </div>
        <div className="flex justify-center mt-4">
            <button className="bg-purple-700  text-white font-bold py-2 px-4 rounded hover:bg-purple-800 transition duration-300 ease-in-out text-lg">View All Cars</button>
        </div>
        </div>
    );
}

export default FeaturedCars;