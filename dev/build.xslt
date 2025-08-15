<?xml version="1.0" encoding="utf-8" ?>
<xsl:stylesheet version="1.0" exclude-result-prefixes="xhtml" xmlns="http://www.w3.org/1999/xhtml" xmlns:fw="http://technolutions.com/framework" xmlns:xhtml="http://www.w3.org/1999/xhtml" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
  <xsl:template match="/">
    <html lang="en" xmlns="http://www.w3.org/1999/xhtml">
      <template path="/shared/base.xslt" xmlns="http://technolutions.com/framework" />
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <!-- Bootstrap CSS -->
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css?v=2" rel="stylesheet" crossorigin="anonymous" />
        <!-- Core styles with versioning -->
        <link href="/dev/styles/variables.css" rel="stylesheet" />
        <link href="/dev/styles/fonts.css?v=20250519002100" rel="stylesheet" />
        <link href="/dev/styles/build.css?v=3" rel="stylesheet" />
        <link href="/dev/styles/loginStyles.css?v=1.0.1" rel="stylesheet" />
        <link href="/dev/styles/FormStyles.css?v=1.1.4" rel="stylesheet" />
        <xsl:apply-templates select="xhtml:html/xhtml:head/node()" />
        <style><![CDATA[
    /* Essential fade-in animation styles */
    body {
      opacity: 0;
      transition: opacity 0.3s ease-in;
    }

    body.fade-in {
      opacity: 1;
    }
]]></style>
        <script><![CDATA[
          document.addEventListener("DOMContentLoaded", function() {
            document.body.classList.add('fade-in');
          });
]]></script>
      </head>
      <body>
        <!-- Header -->
        <div class="network-header">
          <div class="outer-container">
            <div class="inner-container">
              <div class="wordmark">
                <a class="logo" href="https://www.williams.edu" title="Go to Williams College Home" aria-flowto="wms-search-btn">
                  <img src="https://connect.williams.edu/www/images/Branding/hEADER.png" alt="Williams College Header" />
                </a>
              </div>
            </div>
          </div>
        </div>
        <!-- Main Content -->
        <div class="main-bg-wrapper pb-2">
          <main class="container px-2">
            <div id="global" class="text-end" />
            <div id="content">
              <xsl:apply-templates select="xhtml:html/xhtml:body/node()" />
            </div>
          </main>
        </div>
        <!-- Footer -->
        <footer id="colophon" role="contentinfo" class="site-footer bg-custom text-white p-4">
          <div class="container">
            <!-- Two-column section with border bottom -->
            <div class="row border-bottom mb-4">
              <div class="col-md-6 mb-4 p-1 align-items-center justify-content-center">
                <div class="wordmarkf  py-2" style="max-width: 360px">
                  <a aria-label="Go to Williams College Homepage" class="wordmarkf" href="https://www.williams.edu" title="Go to Williams College">
                    <img src="https://connect.williams.edu/www/images/Branding/Footer.png" alt="Williams College Footer Logo" style="width: 100%; height: auto;" />
                  </a>
                </div>
              </div>
              <div class="col-md-6 mb-4 p-1 d-flex align-items-center justify-content-left">
                <div class="address-container">
                  <address class="p-0 mb-0">
              Hopkins Hall<br />
              880 Main Street<br />
              Williamstown, MA 01267 USA<br /><a href="tel:413.597.3131" class="text-white text-decoration-none custom-hover footerlist">(413)
                597-3131</a></address>
                </div>
              </div>
            </div>
            <!-- Four-column section -->
            <div class="row border-bottom pb-0 mb-0">
              <div class="col-6 col-md-3 mb-4 px-1">
                <ul class="list-unstyled m-0">
                  <li>
                    <a href="https://www.williams.edu/admission-aid/visit/" class="text-white text-decoration-none custom-hover footerlist">Visit</a>
                  </li>
                  <li>
                    <a href="https://map.williams.edu" class="text-white text-decoration-none custom-hover footerlist">Campus
                Map</a>
                  </li>
                  <li>
                    <a href="https://diversity.williams.edu/the-stockbridge-munsee-community/" class="text-white text-decoration-none custom-hover footerlist">Land Acknowledgement</a>
                  </li>
                </ul>
              </div>
              <div class="col-6 col-md-3 mb-4 px-1">
                <ul class="list-unstyled m-0">
                  <li>
                    <a href="https://www.williams.edu/people/" class="text-white text-decoration-none custom-hover footerlist">Directory</a>
                  </li>
                  <li>
                    <a href="https://employment.williams.edu/" class="text-white text-decoration-none custom-hover footerlist">Employment</a>
                  </li>
                </ul>
              </div>
              <div class="col-6 col-md-3 mb-4 px-1">
                <ul class="list-unstyled m-0">
                  <li>
                    <a href="https://www.williams.edu/accessible-education/contact-us/" class="text-white text-decoration-none custom-hover footerlist">Accessibility</a>
                  </li>
                  <li>
                    <a href="https://diversity.williams.edu/" class="text-white text-decoration-none custom-hover footerlist">Diversity, Equity &amp; Inclusion</a>
                  </li>
                  <li>
                    <a href="https://sustainability.williams.edu/" class="text-white text-decoration-none custom-hover footerlist">Sustainability</a>
                  </li>
                </ul>
              </div>
              <div class="col-6 col-md-3 mb-4 px-1">
                <ul class="list-unstyled m-0">
                  <li>
                    <a href="https://www.williams.edu/feedback/?source_url=https://www.williams.edu/" class="text-white text-decoration-none custom-hover footerlist">Comment Form</a>
                  </li>
                  <li>
                    <a href="https://www.williams.edu/privacy/" class="text-white text-decoration-none custom-hover footerlist">Privacy Policy</a>
                  </li>
                  <li>
                    <a href="https://diversity.williams.edu/non-discrimination-statement/" class="text-white text-decoration-none custom-hover footerlist">Non-Discrimination Statement</a>
                  </li>
                </ul>
              </div>
            </div>
            <!-- Bottom section with inline list -->
            <div class="row align-items-center justify-content-between py-2">
              <div class="col-md-6 col-12 px-1 mb-2 mb-md-0">
                <ul class="list-inline m-0">
                  <li class="list-inline-item footerlist">Copyright 2025</li>
                </ul>
              </div>
              <div class="col-md-6 col-12 text-md-end text-center">
                <ul class="list-inline m-0">
                  <li class="list-inline-item">
                    <a href="https://www.facebook.com/williamscollege">
                      <svg width="22" height="25" viewBox="0 0 22 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M19.6429 1.5625H2.35714C1.0558 1.5625 0 2.6123 0 3.90625V21.0938C0 22.3877 1.0558 23.4375 2.35714 23.4375H9.09464V16.001H6.00089V12.5H9.09464V9.83398C9.09464 6.79687 10.9116 5.12207 13.696 5.12207C15.0268 5.12207 16.4214 5.35645 16.4214 5.35645V8.33496H14.8844C13.3719 8.33496 12.9004 9.26758 12.9004 10.2246V12.5H16.279L15.7388 16.001H12.9004V23.4375H19.6429C20.9442 23.4375 22 22.3877 22 21.0938V3.90625C22 2.6123 20.9442 1.5625 19.6429 1.5625Z" fill="white">
                        </path>
                      </svg>
                    </a>
                  </li>
                  <li class="list-inline-item">
                    <a href="https://instagram.com/williamscollege">
                      <svg width="20" height="23" viewBox="0 0 20 23" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <g clip-path="url(#clip0_294_271)">
                          <path d="M10.0046 6.5583C7.16535 6.5583 4.87517 8.7626 4.87517 11.4954C4.87517 14.2282 7.16535 16.4325 10.0046 16.4325C12.8439 16.4325 15.1341 14.2282 15.1341 11.4954C15.1341 8.7626 12.8439 6.5583 10.0046 6.5583ZM10.0046 14.7052C8.16982 14.7052 6.66982 13.2657 6.66982 11.4954C6.66982 9.7251 8.16535 8.28564 10.0046 8.28564C11.8439 8.28564 13.3395 9.7251 13.3395 11.4954C13.3395 13.2657 11.8395 14.7052 10.0046 14.7052ZM16.5404 6.35635C16.5404 6.99658 16.0046 7.50791 15.3439 7.50791C14.6787 7.50791 14.1475 6.99229 14.1475 6.35635C14.1475 5.72041 14.6832 5.20478 15.3439 5.20478C16.0046 5.20478 16.5404 5.72041 16.5404 6.35635ZM19.9377 7.5251C19.8618 5.98252 19.4957 4.61611 18.3216 3.49033C17.152 2.36455 15.7323 2.01221 14.1296 1.93486C12.4779 1.84463 7.52696 1.84463 5.87517 1.93486C4.27696 2.00791 2.85732 2.36025 1.68321 3.48604C0.509103 4.61182 0.147496 5.97822 0.0671387 7.5208C-0.0266113 9.11064 -0.0266113 13.8759 0.0671387 15.4657C0.143032 17.0083 0.509103 18.3747 1.68321 19.5005C2.85732 20.6263 4.2725 20.9786 5.87517 21.056C7.52696 21.1462 12.4779 21.1462 14.1296 21.056C15.7323 20.9829 17.152 20.6306 18.3216 19.5005C19.4912 18.3747 19.8573 17.0083 19.9377 15.4657C20.0314 13.8759 20.0314 9.11494 19.9377 7.5251ZM17.8037 17.1716C17.4555 18.0138 16.7814 18.6626 15.902 19.0021C14.585 19.5048 11.46 19.3888 10.0046 19.3888C8.54928 19.3888 5.41982 19.5005 4.10732 19.0021C3.23232 18.6669 2.55821 18.0181 2.20553 17.1716C1.68321 15.904 1.80375 12.8962 1.80375 11.4954C1.80375 10.0946 1.68767 7.08252 2.20553 5.81924C2.55375 4.97705 3.22785 4.32822 4.10732 3.98877C5.42428 3.48603 8.54928 3.60205 10.0046 3.60205C11.46 3.60205 14.5895 3.49033 15.902 3.98877C16.777 4.32393 17.4511 4.97275 17.8037 5.81924C18.3261 7.08682 18.2055 10.0946 18.2055 11.4954C18.2055 12.8962 18.3261 15.9083 17.8037 17.1716Z" fill="white">
                          </path>
                        </g>
                        <defs>
                          <clipPath id="clip0_294_271">
                            <rect width="20" height="22" fill="white" transform="translate(0 0.5)">
                            </rect>
                          </clipPath>
                        </defs>
                      </svg>
                    </a>
                  </li>
                  <li class="list-inline-item">
                    <a href="https://www.linkedin.com/edu/school?id=18537">
                      <svg width="20" height="23" viewBox="0 0 20 23" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M18.5714 1.875H1.42411C0.638393 1.875 0 2.49805 0 3.26289V19.7371C0 20.502 0.638393 21.125 1.42411 21.125H18.5714C19.3571 21.125 20 20.502 20 19.7371V3.26289C20 2.49805 19.3571 1.875 18.5714 1.875ZM6.04464 18.375H3.08036V9.18828H6.04911V18.375H6.04464ZM4.5625 7.93359C3.61161 7.93359 2.84375 7.19023 2.84375 6.2793C2.84375 5.36836 3.61161 4.625 4.5625 4.625C5.50893 4.625 6.28125 5.36836 6.28125 6.2793C6.28125 7.19453 5.51339 7.93359 4.5625 7.93359ZM17.1562 18.375H14.192V13.9062C14.192 12.8406 14.1696 11.4699 12.6518 11.4699C11.1071 11.4699 10.8705 12.6301 10.8705 13.8289V18.375H7.90625V9.18828H10.75V10.443H10.7902C11.1875 9.72109 12.1563 8.96055 13.5982 8.96055C16.5982 8.96055 17.1562 10.8641 17.1562 13.3391V18.375Z" fill="white">
                        </path>
                      </svg>
                    </a>
                  </li>
                  <li class="list-inline-item">
                    <a href="https://www.threads.net/@williamscollege">
                      <svg width="19" height="23" viewBox="0 0 19 23" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <g clip-path="url(#clip0_293_263)">
                          <path d="M14.488 10.5675C14.5892 10.6087 14.6812 10.6546 14.7778 10.6958C16.1208 11.3419 17.1051 12.3088 17.6202 13.5094C18.3423 15.1819 18.4113 17.8993 16.2266 20.0713C14.5616 21.7302 12.5333 22.4771 9.66788 22.5H9.65408C6.42532 22.4771 3.94626 21.3956 2.27669 19.2832C0.791092 17.4044 0.0275962 14.7879 0 11.5115V11.4885C0.0229969 8.21214 0.786492 5.5956 2.27209 3.71683C3.94166 1.60435 6.42532 0.522912 9.65408 0.5H9.66788C12.9012 0.522912 15.4125 1.59977 17.1327 3.70308C17.9789 4.74328 18.6045 5.99427 19 7.44689L17.1419 7.94178C16.8153 6.75953 16.3232 5.75141 15.6609 4.94491C14.3178 3.30442 12.3033 2.46126 9.65868 2.44293C7.03704 2.46584 5.05471 3.30442 3.76229 4.93574C2.55725 6.46167 1.93174 8.67038 1.90874 11.4977C1.93174 14.325 2.55725 16.5337 3.76229 18.0643C5.05011 19.6956 7.03704 20.5342 9.65868 20.5571C12.0228 20.5387 13.5865 19.9797 14.8882 18.6829C16.3738 17.2074 16.3462 15.3927 15.8724 14.2884C15.5919 13.6377 15.0859 13.097 14.4052 12.6891C14.2351 13.9218 13.8625 14.9024 13.2692 15.6585C12.4827 16.6575 11.365 17.1982 9.92544 17.2761C8.83999 17.3357 7.79593 17.0745 6.98644 16.5429C6.02977 15.9105 5.46865 14.9482 5.40886 13.8256C5.29388 11.6123 7.05084 10.0222 9.78746 9.86638C10.7579 9.81139 11.6686 9.85263 12.5103 9.99469C12.3999 9.3165 12.1745 8.77578 11.8388 8.38169C11.3788 7.84555 10.6613 7.57061 9.71387 7.56603H9.68167C8.91818 7.56603 7.88792 7.77682 7.23021 8.77119L5.64803 7.68975C6.53111 6.35628 7.96151 5.6231 9.68627 5.6231H9.72307C12.6023 5.64143 14.3178 7.43314 14.4926 10.5583L14.4834 10.5675H14.488ZM7.313 13.7202C7.37279 14.8703 8.61922 15.4065 9.82426 15.3377C11.0017 15.2736 12.3355 14.8154 12.5609 11.9834C11.9538 11.8506 11.2823 11.7818 10.5648 11.7818C10.344 11.7818 10.1232 11.7864 9.90244 11.8001C7.92931 11.9101 7.27161 12.8633 7.3176 13.7156L7.313 13.7202Z" fill="white">
                          </path>
                        </g>
                        <defs>
                          <clipPath id="clip0_293_263">
                            <rect width="19" height="22" fill="white" transform="translate(0 0.5)">
                            </rect>
                          </clipPath>
                        </defs>
                      </svg>
                    </a>
                  </li>
                  <li class="list-inline-item">
                    <a href="https://twitter.com/williamscollege">
                      <svg width="22" height="23" viewBox="0 0 22 23" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M16.7234 2.5625H19.757L13.1312 10.1336L20.9258 20.4375H14.8242L10.0418 14.1898L4.57616 20.4375H1.53827L8.62382 12.3379L1.15155 2.5625H7.4078L11.7262 8.27305L16.7234 2.5625ZM15.6578 18.6242H17.3379L6.49257 4.28125H4.68788L15.6578 18.6242Z" fill="white">
                        </path>
                      </svg>
                    </a>
                  </li>
                  <li class="list-inline-item">
                    <a href="https://www.youtube.com/williamscollege">
                      <svg width="25" height="23" viewBox="0 0 25 23" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M23.8585 5.83242C23.5851 4.81406 22.7821 4.01484 21.7622 3.74414C19.9132 3.25 12.5 3.25 12.5 3.25C12.5 3.25 5.08683 3.25 3.23787 3.74414C2.21791 4.01484 1.41496 4.81406 1.14152 5.83242C0.646729 7.67578 0.646729 11.5172 0.646729 11.5172C0.646729 11.5172 0.646729 15.3586 1.14152 17.202C1.41496 18.216 2.21791 18.9852 3.23787 19.2559C5.08683 19.75 12.5 19.75 12.5 19.75C12.5 19.75 19.9132 19.75 21.7622 19.2559C22.7821 18.9852 23.5851 18.216 23.8585 17.202C24.3533 15.3586 24.3533 11.5172 24.3533 11.5172C24.3533 11.5172 24.3533 7.67578 23.8585 5.83242ZM10.0738 15.0063V8.02812L16.2674 11.5172L10.0738 15.0063Z" fill="white">
                        </path>
                      </svg>
                    </a>
                  </li>
                  <li>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </footer>
        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js?v=2" crossorigin="anonymous">
        </script>
        <!-- Add bottom scripts for proper functionality -->
        <script src="/dev/scripts/brandingScripts.js?v=1.0.1">
        </script>
        <script src="/dev/scripts/formScripts.js?v=20250519111500">
        </script>
      </body>
    </html>
  </xsl:template>
  <xsl:template match="@* | node()">
    <xsl:copy>
      <xsl:apply-templates select="@* | node()" />
    </xsl:copy>
  </xsl:template>
</xsl:stylesheet>
