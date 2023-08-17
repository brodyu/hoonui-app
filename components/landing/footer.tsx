import Container from '../container'
import Image from 'next/image'

const Footer = () => {
  return (
    <footer className="bg-neutral-200 border-t border-neutral-200">
      <Container>
        <div className="py-28 flex-col md:flex-row flex items-center md:justify-between">
          <div className="w-full sm:w-auto text-center sm:text-left mb-4 sm:mb-0">
            <Image
              src="/assets/Black logo - no background.png"
              width={400}
              height={400}
              alt="Icon"
            />
          </div>
          <div className="w-full sm:w-auto text-center sm:text-right">
            <h3 className="font-bold text-xl mb-2">
              Contact Us
            </h3>
            <p className="mb-1">
              <span className="font-bold">Phone:</span> (808) 348-5018
            </p>
            <p>
              <span className="font-bold">Email:</span>{' '}
              <a
                href="mailto:info@hoonuitechnologies.dev"
                className="text-blue-400 hover:text-blue-600"
              >
                info@hoonuitechnologies.dev
              </a>
            </p>
          </div>
        </div>
      </Container>
    </footer>
  )
}

export default Footer
