// ==UserScript==
// @name     Wolt Search Filter Script
// @version  1
// @grant    none
// @include	 https://wolt.com/*
// ==/UserScript==

// consts - consts - consts - consts - consts - consts - consts - consts - consts - consts - consts - consts - consts - consts - consts - consts - consts - consts - consts - consts - consts

const filterButtonParentQuery = '[class^=DiscoveryPageTitle__Root]';
const resultContainerQuery = '[class^=VenueVerticalList]';
const restaurantOpenSound = '';

const settings = {
  sort: true,
};

// styles - styles - styles - styles - styles - styles - styles - styles - styles - styles - styles - styles - styles - styles - styles - styles - styles - styles - styles - styles - styles

function addStyles() {
	var styles = `
		.filter-button-container {
			float: left;
			position: relative;
			bottom: 3rem;
			left: 3rem;
		}

    .result-sort-button {
			cursor: pointer;

			color: #009de0;
			stroke: #009de0;
			background-color: #009de014;
				
			border-radius: 50%;

			width: 2.5rem;
			height: 2.5rem;

			display: flex;
      align-items: center;
      justify-content: center;
    }

		.result-sort-button > svg {
			width: 1.25rem;
			height: 1.25rem;
		}

    .result-sort-button:hover {
			background-color: #009de029;
      color: #009de0eb;
    }

		.filter-settings-window {
			position: absolute;
			top: 0;
			left: 3rem;

			padding: 1rem;

			background-color: #009de014;
			border-radius: 1rem;
		}

		.filter-window-row {
			display: flex;
      gap: 1em;
      align-items: center;
		}

		.filter-window-row-label {
			
		}
`

  var styleSheet = document.createElement("style");
  styleSheet.type = "text/css";
  styleSheet.innerText = styles;
  document.head.appendChild(styleSheet);
}



// filter button - filter button - filter button - filter button - filter button - filter button - filter button - filter button - filter button - filter button - filter button - filter button

let filterButtonContainer;

function createFilterButton() {
	filterButtonContainer = document.createElement('div');
  
  const filterButton = document.createElement('div');
  filterButton.classList.add('result-sort-button');
  filterButton.onclick = () => {
//     openFilterSettingsWindow();
    sortPageResults();
  };
  filterButton.innerHTML = `
    <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 32 32" style="enable-background:new 0 0 32 32;" xml:space="preserve">
    	<path id="slider_2_" d="M16,31.36c-1.731,0-3.161-1.316-3.341-3H1v-0.72h11.659c0.18-1.684,1.61-3,3.341-3s3.161,1.316,3.341,3H31  v0.721H19.341C19.161,30.044,17.731,31.36,16,31.36z M16,25.36c-1.456,0-2.64,1.184-2.64,2.64s1.185,2.64,2.64,2.64  c1.456,0,2.64-1.184,2.64-2.64S17.456,25.36,16,25.36z M25,19.36c-1.731,0-3.161-1.316-3.341-3H1v-0.72h20.659  c0.18-1.684,1.609-3,3.341-3s3.161,1.316,3.341,3H31v0.72h-2.659C28.161,18.044,26.731,19.36,25,19.36z M25,13.36  c-1.456,0-2.64,1.185-2.64,2.64c0,1.456,1.184,2.64,2.64,2.64s2.64-1.184,2.64-2.64S26.456,13.36,25,13.36z M7,7.36  c-1.731,0-3.161-1.316-3.341-3H1V3.64h2.659c0.18-1.684,1.61-3,3.341-3s3.161,1.316,3.341,3H31v0.72H10.341  C10.161,6.044,8.731,7.36,7,7.36z M7,1.36C5.544,1.36,4.36,2.544,4.36,4S5.544,6.64,7,6.64S9.64,5.456,9.64,4S8.456,1.36,7,1.36z"/>
    </svg>
	`;
  
  filterButtonContainer.appendChild(filterButton);
  filterButtonContainer.classList.add('filter-button-container');
  
  return filterButtonContainer;
}

function addFilterButton() {
	document.querySelector(filterButtonParentQuery).appendChild(createFilterButton())
}



// filter settings - filter settings - filter settings - filter settings - filter settings - filter settings - filter settings - filter settings - filter settings - filter settings - filter settings

let filterSettingsWindowElement;

function changeSetting(name, value) {
  settings[name] = value;
};

function createFilterWindowRowToggle(value = false, onChange) {
  const rowInput = document.createElement('input');
  rowInput.type = "checkbox";
  rowInput.checked = value;
  rowInput.onclick = (e) => {
    onChange(e.target.checked);
  };
  
  return rowInput;
}

function createFilterWindowRowLabel(text) {
  const rowLabel = document.createElement('div');
  rowLabel.classList.add('filter-window-row-label')
  rowLabel.innerText = text;
  
  return rowLabel;
}

function createFilterWindowRow(label, value, onChange) {
  const filterRow = document.createElement('div');
  filterRow.classList.add('filter-window-row');
  filterRow.appendChild(createFilterWindowRowLabel(label));
  filterRow.appendChild(createFilterWindowRowToggle(value, onChange));
  
  return filterRow;
}

function createFilterSettingsWindowCloseButton() {
  const closeButton = document.createElement('div');
  closeButton.innerHTML = `
		<div style="position: absolute; top:0.25rem; left: 0.25rem; width: 1rem; height: 1rem; cursor: pointer;">
      <svg viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" fill="currentColor" stroke="black" class="bi bi-x">
        <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
      </svg>	
		</div>
`;
  closeButton.onclick = () => {
    closeFilterSettingsWindow();
  };  
  
  return closeButton;
}

function createFilterSettingsWindow() {
  filterSettingsWindowElement = document.createElement('div');
  filterSettingsWindowElement.classList.add('filter-settings-window');
  
  filterSettingsWindowElement.appendChild(createFilterWindowRow("Sort", settings.sort, (value) => {
    changeSetting("sort", value);
  }));
  
  filterSettingsWindowElement.appendChild(createFilterSettingsWindowCloseButton());
  
  return filterSettingsWindowElement;
}

function openFilterSettingsWindow() {
  filterButtonContainer.appendChild(createFilterSettingsWindow());
}

function closeFilterSettingsWindow() {
  console.log(filterButtonContainer);
  console.log(filterButtonContainer.querySelector('.filter-settings-window'))
  filterButtonContainer.removeChild(filterButtonContainer.querySelector('.filter-settings-window'));
}


// page waits - page waits - page waits - page waits - page waits - page waits - page waits - page waits - page waits - page waits - page waits - page waits - page waits - page waits - page waits

function waitForResultContainer() {
  return new Promise((res, rej) => {
    const checkInterval = setInterval(() => {
      if (document.querySelector(resultContainerQuery)) {
        clearInterval(checkInterval);
        res(true);
      }
    }, 1000);
  });
}



// sorting - sorting - sorting - sorting - sorting - sorting - sorting - sorting - sorting - sorting - sorting - sorting - sorting - sorting - sorting - sorting - sorting - sorting - sorting

function sortPageResults() {
  const frag = document.createDocumentFragment();
  
  const resultContainer = document.querySelector(resultContainerQuery);
  const resultElements = Array.from(resultContainer.querySelectorAll(':scope > a'));
  
  const sortedResults = resultElements.map(r => ({
    element: r,
    rating: parseFloat(r.querySelector('[class^=VenueCardFooter__FooterContentWrapper]:last-child > [class^=VenueCardFooter__FooterContent]').textContent)
  })).sort((a, b) => b.rating - a.rating);

  for (let item of sortedResults)
    frag.appendChild(item.element);
  
  resultContainer.appendChild(frag);
}



// init - init - init - init - init - init - init - init - init - init - init - init - init - init - init - init - init - init - init - init - init - init - init - init - init - init - init

function init() {
  addStyles();
	addFilterButton();
  sortPageResults();
}

waitForResultContainer().then(init);
