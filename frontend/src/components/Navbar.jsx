function Navbar() {
  return (
    <nav className="bg-[#0f1c35] w-full top-0 border-b border-sky-500 z-20">
      <div className="max-w-screen-xl mx-auto flex items-center justify-between p-4">
        <a href="#" className="flex items-center space-x-2">
          <span className="text-2xl font-bold text-white">TicketTime</span>
          <span className="text-sm font-medium text-sky-300 hidden sm:block">
            : Your Gateway to Unforgettable Experiences!
          </span>
        </a>

        <div className="md:order-2">
          <button
            type="button"
            className="text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-500 font-medium rounded-lg text-sm px-4 py-2"
          >
            Book Now
          </button>
        </div>

        <div
          className="hidden md:flex md:items-center md:space-x-6"
          id="navbar-sticky"
        ></div>
      </div>
    </nav>
  );
}

export default Navbar;
