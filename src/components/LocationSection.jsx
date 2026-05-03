export default function LocationSection() {
          return (
            <section className="mt-16 mb-16">
              <div className="max-w-6xl mx-auto px-4 ">
                
                {/* Heading */}
                <div className="mb-2 flex items-center justify-center">
                  <h2 className="text-3xl md:text-4xl font-black ">
                    Our Location
                  </h2>
                </div>
                <div className="mb-4 flex items-center justify-center">
                <p className="text-white/60">
                    Visit our office for property consultations and site visits.
                  </p>
                </div>

                <div className="p-4  flex flex-col md:flex-row md:items-center md:justify-between gap-3">
  <p className=" text-white/70">
    VPF Properties, Kukatpally, Hyderabad
  </p>

  <a
    href="https://www.google.com/maps/place/VPF+Properties/@17.4947163,78.4048628"
    target="_blank"
    rel="noopener noreferrer"
    className="text-sm bg-yellow-400 text-black px-4 py-2 rounded-xl font-medium hover:bg-yellow-300 w-fit"
  >
    Open in Google Maps
  </a>
</div>
        
                {/* Map Card */}
                <div className="rounded-2xl overflow-hidden border border-white/10 bg-[#020617]">
                  <iframe
                    src="https://www.google.com/maps?q=17.4947163,78.4048628&z=15&output=embed"
                    width="100%"
                    height="400"
                    loading="lazy"
                    className="w-full h-[400px] border-0"
                    referrerPolicy="no-referrer-when-downgrade"
                  ></iframe>
                </div>
        
              </div>
            </section>
          );
        }