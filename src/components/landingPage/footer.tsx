export function Footer() {
    return (
        <div>
            {/* Footer */}
            <footer className="bg-gray-900 text-white py-10 px-4">
                <div className="max-w-6xl mx-auto">
                    <div className="flex flex-col md:flex-row justify-between items-center">
                        <div className="mb-6 md:mb-0">
                            <h3 className="text-2xl font-bold">ShopSage</h3>
                            <p className="text-gray-400 mt-2">Smart Business Management Solution</p>
                        </div>

                        <div className="flex flex-col md:flex-row gap-6 md:gap-12">
                            <div>
                                <h4 className="font-bold mb-2 text-center md:text-left">Product</h4>
                                <ul className="space-y-1 text-gray-400 text-center md:text-left">
                                    <li>Features</li>
                                    <li>Pricing</li>
                                    <li>Support</li>
                                </ul>
                            </div>

                            <div>
                                <h4 className="font-bold mb-2 text-center md:text-left">Company</h4>
                                <ul className="space-y-1 text-gray-400 text-center md:text-left">
                                    <li>About Us</li>
                                    <li>
            <a 
                href="https://swarnitsinha.github.io/myportfolio/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="hover:text-green-400 transition-colors"
            >
                Contact
            </a>
        </li>
                                    <li>Blog</li>
                                </ul>
                            </div>

                            <div>
                                <h4 className="font-bold mb-2 text-center md:text-left">Legal</h4>
                                <ul className="space-y-1 text-gray-400 text-center md:text-left">
                                    <li>Privacy</li>
                                    <li>Terms</li>
                                    <li>Security</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 pt-6 border-t border-gray-800 text-center">
                        <p className="text-gray-500">© 2025 ShopSage. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </div>
    )
}