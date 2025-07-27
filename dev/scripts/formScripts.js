const FORM_CONFIG = {
    WEB_SERVICE: {
      BASE_URL: 'https://connect.williams.edu/manage/query/run',
      QUERY_ID: '4bf6fb4b-518a-4bdb-ac6c-0b91ef97eb6b',
      HASH: '1f23a389-bab1-4d45-a3c2-74dbba7812ff'
    },
    SELECTORS: {
      GUID_INPUT: 'input[name="id"]'
    }
  };
  
  /**
   * Fetches form configuration based on GUID
   * @param {string} guid - The GUID to query
   * @returns {Promise<Object|null>} Configuration data or null if request fails
   */
  async function fetchFormConfig(guid) {
    const url = `${FORM_CONFIG.WEB_SERVICE.BASE_URL}?id=${FORM_CONFIG.WEB_SERVICE.QUERY_ID}&cmd=service&output=json&h=${FORM_CONFIG.WEB_SERVICE.HASH}&form=${guid}`;
    
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error('[Form Config] Failed to fetch configuration:', error);
      return null;
    }
  }
  
  /**
   * Initializes form based on GUID configuration
   */
  async function initializeForm() {
    const inputElement = document.getElementsByName("id")[0];
    if (!inputElement) {
     
      return;
    }
  
    const guidValue = inputElement.value;
    if (!guidValue) {
     
      return;
    }
  
    const config = await fetchFormConfig(guidValue);
    if (!config?.row?.[0]) {
     
      return;
    }
  
    const settings = config.row[0];
    
    // Execute scripts based on configuration
    if (settings.preventPrepop === "1") {
      CustomFormScripts.preventPrepopOnAddGuest();
    }
    
    if (settings.addBgImage) {
      CustomFormScripts.addBgImage(settings.addBgImage);
    }
  
    if (settings.hideMapLocation === "1") {
      CustomFormScripts.hideMapAndLocation();
    }
  
    if (settings.hideRegisterDate === "1") {
      CustomFormScripts.hideRegisterDate();
    }
  }
  
  const CustomFormScripts = {
    hideMapAndLocation() {
      $("#register_map").remove();
      $("#map").remove();
      $("#register_location").remove();
    },
  
    hideRegisterDate() {
      $("#register_date").remove();
    },
  
    replaceRedirect(newUrl) {
      $("#form_response_banner a").attr("href", newUrl);
    },
  
    addBgImage(url) {
      document.body.style.background = `url('${url}') no-repeat center center fixed`;
      document.body.style.backgroundSize = "cover";
    },
  
    preventPrepopOnAddGuest() {
      $(document).ready(() => {
        const clearFieldsInNewBlock = ($block) => {
          const replicateId = $block.data("replicate_id");
          if (!replicateId || replicateId <= 1) return;
    
          $block
            .find(
              "div[data-export='sys:first'], " +
                "div[data-export='sys:middle'], " +
                "div[data-export='sys:last'], " +
                "div[data-export='sys:email'], " +
                "div[data-export='sys:mobile'], " +
                "div[data-export='sys:field:preferred_class_year'], " +
                "div[data-export='sys:preferred']"
            )
            .find("input[type='text'], input[type='email']")
            .val("");
    
          $block
            .find("div[data-export='sys:birthdate']")
            .find(
              "select[aria-label='Month'], select[aria-label='Day'], select[aria-label='Year']"
            )
            .val("");
        };
    
        const observer = new MutationObserver((mutationsList) => {
          for (const mutation of mutationsList) {
            if (mutation.type === "childList" && mutation.addedNodes.length) {
              $(mutation.addedNodes).each(function () {
                $("tbody.replicate_destination[data-replicate_id='1']")
                  .find("tr.column a.replicate_delete")
                  .css("display", "none");
                if (
                  $(this).is("tbody.replicate_destination[data-replicate_id]")
                ) {
                  clearFieldsInNewBlock($(this));
                }
              });
            }
          }
        });
    
        observer.observe(document.documentElement, {
          childList: true,
          subtree: true,
        });
      });
    },
  };
  
  // Initialize when DOM is ready
  document.addEventListener("DOMContentLoaded", initializeForm);
    
