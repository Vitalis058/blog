import { Footer } from "flowbite-react";
import { Link } from "react-router-dom";
import {
  BsDribbble,
  BsFacebook,
  BsGithub,
  BsInstagram,
  BsTwitter,
} from "react-icons/bs";

function FooterComponent() {
  return (
    <Footer container className="border border-t-8 border-teal-500">
      <div className="mx-auto w-full max-w-7xl">
        <div className="grid w-full justify-between sm:flex ">
          {/* LOGO container */}
          <div className="mt-5">
            <Link to="/">
              <img
                src="https://firebasestorage.googleapis.com/v0/b/mern-blog-2e34f.appspot.com/o/logo%2Flogo-5-02.png?alt=media&token=784f9da5-d569-41b8-bdc0-559ffd55928c"
                alt=""
                srcset=""
                className="w-24"
              />
            </Link>
          </div>

          {/* LINKS */}
          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3 ">
            {/* nav Links */}
            <div>
              <Footer.Title title="About" />
              <Footer.LinkGroup col>
                <Footer.Link
                  href="https://www.100jsprojects.com"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  100 js projects
                </Footer.Link>
                <Footer.Link
                  href="/about"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  About
                </Footer.Link>
              </Footer.LinkGroup>
            </div>

            {/* social links */}
            <div>
              <Footer.Title title="Follow us" />
              <Footer.LinkGroup col>
                <Footer.Link
                  href="https://www.github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  GitHub
                </Footer.Link>
                <Footer.Link
                  href="www.facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  FaceBook
                </Footer.Link>
              </Footer.LinkGroup>
            </div>

            {/* privacy policy */}
            <div>
              <Footer.Title title="Legal" />
              <Footer.LinkGroup col>
                <Footer.Link href="#">Privacy Policy</Footer.Link>
                <Footer.Link href="/about">Terms And Conditions</Footer.Link>
              </Footer.LinkGroup>
            </div>
          </div>
        </div>

        <Footer.Divider />

        <div className="w-full sm:flex sm:items-center sm:justify-between">
          <Footer.Copyright
            href="#"
            by="vitalis Maina"
            year={new Date().getFullYear()}
          />
          <div className="mt-5 flex space-x-4 sm:mt-0 sm:justify-center">
            <Footer.Icon href="#" icon={BsFacebook} />
            <Footer.Icon href="#" icon={BsInstagram} />
            <Footer.Icon href="#" icon={BsTwitter} />
            <Footer.Icon href="#" icon={BsGithub} />
            <Footer.Icon href="#" icon={BsDribbble} />
          </div>
        </div>
      </div>
    </Footer>
  );
}

export default FooterComponent;
