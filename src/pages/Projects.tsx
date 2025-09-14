import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";

const Projects = () => {
  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
      <Carousel className="w-full max-w-5xl">
        <CarouselContent>
          <CarouselItem>
            <div className="space-y-6">
              <header className="text-center space-y-2">
                <h1 className="text-3xl font-bold">iBUILD's Residential Products</h1>
                <p className="text-red-500 font-semibold">Building Vibrant Communities, One Parcel at a Time</p>
              </header>
              <p>
                When it comes to Land Acquisition and Land Development, iBUILD equips developers with the tools to transform
                tracts into thriving communities. From raw land into parcels or phases, iBUILD gives neighborhoods the detail
                to ensure no aspect is overlooked.
              </p>
              <section className="space-y-3">
                <h2 className="text-2xl text-red-500 font-semibold">
                  Land Acquisition & Administration – Product #1
                </h2>
                <p>
                  iBUILD's Land Acquisition & Administration module provides an in-depth approach for every critical area to
                  ensure nothing is overlooked.
                </p>
                <ul className="list-disc list-inside space-y-1">
                  <li>
                    <strong>Architects & Consultants:</strong> Strategically assemble and manage design professionals.
                  </li>
                  <li>
                    <strong>Engineers:</strong> Experience comprehensive support for seamless planning.
                  </li>
                  <li>
                    <strong>Permits & Fees:</strong> Navigate approvals, fee management and compliance planning.
                  </li>
                  <li>
                    <strong>Financiers:</strong> Gain real-time insights into expenditures, compliance and project progress.
                  </li>
                  <li>
                    <strong>Construction:</strong> Plan corporation costs, shareholder management and asset-specific oversight.
                  </li>
                  <li>
                    <strong>Intellectual Property:</strong> Safeguard your project with robust protections.
                  </li>
                  <li>
                    <strong>Management, legal, permit dashboards:</strong> Real-time tracking and reporting.
                  </li>
                  <li>
                    <strong>Docs and final compliance:</strong> Phase and permit project completion.
                  </li>
                </ul>
              </section>
              <section className="space-y-3">
                <h2 className="text-2xl text-red-500 font-semibold">Land Development – Product #2</h2>
                <p>iBUILD's comprehensive Residential Land Development module.</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>
                    <strong>Site Development & Building Costs:</strong> Optimize infrastructure investments.
                  </li>
                  <li>
                    <strong>Servicing Costs:</strong> Track and control servicing costs throughout each development phase.
                  </li>
                  <li>
                    <strong>Site Landscaping Costs:</strong> Ensure comprehensive site development and landscaping control.
                  </li>
                </ul>
                <p>
                  With iBUILD, nothing is accidentally missed; every asset is meticulously managed to deliver your intended
                  outcomes.
                </p>
              </section>
            </div>
          </CarouselItem>

          <CarouselItem>
            <div className="space-y-6">
              <header className="text-center space-y-2">
                <h2 className="text-2xl text-red-500 font-semibold">
                  Multi-Unit Residential Buildings (MURBs) – Product #3
                </h2>
              </header>
              <p>
                Driving Success in Multi-Family Residential Projects: From duplexes, townhouses to 3 or more storey apartment
                buildings, iBUILD gives unmatched support for multi-unit residential developments.
              </p>
              <p>
                With robust tools and expert guidance, iBUILD streamlines your workflow, ensures regulatory compliance, and
                delivers efficiency.
              </p>
              <p>
                iBUILD eliminates inefficiencies in managing complex projects saving time and energy, increasing productivity,
                and reducing costs.
              </p>
              <p>
                <strong>Digital-Driven Project Proforma Forecasting Module:</strong> iBUILD is the only SaaS construction and
                business management platform to effortlessly offer this groundbreaking technology to small/large projects faster
                than ever before.
              </p>
              <p>
                iBUILD delivers customization and endless expert knowledge you'll want to project with:
              </p>
              <p className="font-semibold">Total Project Flexibility: Customize every aspect of your project with:</p>
              <p className="font-semibold">Foundation Options:</p>
              <ul className="list-disc list-inside">
                <li>Basement</li>
                <li>Slab-On-Grade</li>
                <li>Crawl Space / Pile Columns</li>
                <li>Attached Underground Parkade</li>
                <li>Heated Garage</li>
                <li>Detached Garage (With or Without A Secondary Suite)</li>
                <li>Carport</li>
                <li>Rear Lane Parking Stalls / Pads</li>
                <li>Elevated Slab / Vertical Concrete Parkade</li>
              </ul>
              <p className="font-semibold">Parking Options:</p>
              <ul className="list-disc list-inside">
                <li>Attached Garage</li>
                <li>Detached Garage (With or Without A Secondary Suite)</li>
                <li>Carport</li>
                <li>Rear Lane Parking Stalls / Pads</li>
                <li>Elevated Slab / Vertical Concrete Parkade</li>
              </ul>
              <p className="font-bold">
                A Comprehensive Approach for Multi-Unit Success: iBUILD covers every detail from Land Uses to Common Areas,
                Common Buildings, Landscaping, and more – no challenge is too complex for multi-unit developers.
              </p>
            </div>
          </CarouselItem>

          <CarouselItem>
            <div className="space-y-6">
              <header className="text-center space-y-2">
                <h2 className="text-2xl text-red-500 font-semibold">
                  Single-Family Residential Builders – Product #4
                </h2>
                <p className="italic">Builders Clients Visions Realized</p>
              </header>
              <p>
                At iBUILD, we understand that homes are more than just structures; they are the foundation for cherished
                memories. iBUILD's cloud software solutions empower builders to bring their clients' visions to life, combining
                innovation with flexibility.
              </p>
              <p className="text-lg font-semibold text-center">What Sets iBUILD Apart?</p>
              <p>
                iBUILD's fully integrated tools give builders complete freedom to customize Single-Family Residential projects
                based on what their diverse client needs.
              </p>
              <p className="font-semibold">Foundation Options:</p>
              <ul className="list-disc list-inside">
                <li>Basement</li>
                <li>Slab-On-Grade</li>
                <li>Crawl Space / Pile Columns</li>
              </ul>
              <p className="font-semibold">Parking Solutions:</p>
              <ul className="list-disc list-inside">
                <li>Attached Garage</li>
                <li>Detached Garage (With or Without A Secondary Suite)</li>
                <li>Carport</li>
                <li>Rear Lane Parking Stalls / Pads</li>
              </ul>
              <p className="font-semibold">Garden Patio Decks:</p>
              <ul className="list-disc list-inside">
                <li>Garage Deck Roof</li>
              </ul>
              <p className="font-semibold">Basement Development Options:</p>
              <p>Enhance your offering with our specialized basement development option capabilities.</p>
              <p className="font-bold">
                Streamline Your Workflow, Elevate Your Results: Say goodbye to inefficiencies. With iBUILD, every need from
                design, tracking and managing Single-Family projects is just a click away.
              </p>
              <p className="text-center font-semibold">
                Curious About More of Our Solutions – Schedule a Free Demo Today
              </p>
            </div>
          </CarouselItem>
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  );
};

export default Projects;

