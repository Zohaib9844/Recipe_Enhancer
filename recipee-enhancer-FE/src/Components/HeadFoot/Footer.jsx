





export default function Footer() {
    return (
      <footer className="bg-gray-800 text-white py-8 mt-12">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <div className="flex flex-wrap justify-between">
            <div className="w-full md:w-1/2 lg:w-1/3 mb-6 md:mb-0">
              <h5 className="text-lg font-bold mb-2">Recipe Enhancer</h5>
              <p className="text-sm">
                Elevate your cooking experience with our recipe enhancer. Discover
                new flavors, ingredients, and cooking techniques.
              </p>
            </div>
            <div className="w-full md:w-1/2 lg:w-1/3 mb-6 md:mb-0">
              <h5 className="text-lg font-bold mb-2">Quick Links</h5>
              <ul>
                <li className="mb-2">
                  <a href="#" className="hover:text-gray-300">
                    Home
                  </a>
                </li>
                <li className="mb-2">
                  <a href="#" className="hover:text-gray-300">
                    Recipes
                  </a>
                </li>
                <li className="mb-2">
                  <a href="#" className="hover:text-gray-300">
                    About
                  </a>
                </li>
                <li className="mb-2">
                  <a href="#" className="hover:text-gray-300">
                    Contact
                  </a>
                </li>
              </ul>
            </div>
            <div className="w-full md:w-1/2 lg:w-1/3 mb-6 md:mb-0">
              <h5 className="text-lg font-bold mb-2">Follow Us</h5>
              <ul className="flex space-x-4">
                <li>
                  <a href="#" className="hover:text-gray-300">
                    <i className="fab fa-facebook-f"></i>
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-gray-300">
                    <i className="fab fa-twitter"></i>
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-gray-300">
                    <i className="fab fa-instagram"></i>
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="text-center mt-8">
            <p>&copy; {new Date().getFullYear()} Recipe Enhancer</p>
          </div>
        </div>
      </footer>
    );
  }
  
  