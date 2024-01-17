import AbstractView from "./AbstractView.js";
import { supabaseClient, navigateTo, removeAllChildren } from "../index.js";

export default class extends AbstractView {
  constructor(params) {
    super(params);
    this.setTitle("Set Election");
    this.openNav = false;
    this.supabaseClient = supabaseClient;
    this.loading = false;
    this.isFetching = false;
    this.departments = null;
    this.selectedOptions = new Set();
    this.formState = {
      election_title: "",
      election_description: "",
      errors: {},
      touched: {},
      isSubmitting: false,
    };

    this.validationSchema = {
      election_title: [
        (value) => (value.length === 0 ? "Email is required" : ""),
      ],
      election_description: [
        (value) => (value.length === 0 ? "Description is required" : ""),
      ],
    };
  }

  createElectionForm() {}

  async fetchFaculties() {
    const { data } = await supabaseClient.from("faculties").select(`
        faculty_id,
        faculty_name,
        departments(
          department_id,
          department_description
        )
      `);

    return data;
  }

  createSelectInput(options, placeholder) {
    const container = document.createElement("div");
    container.className = "relative";

    const inputContainer = document.createElement("div");
    inputContainer.className = "relative flex items-center"; // Added flex and items-center

    const selectedOptions = new Set();

    const input = document.createElement("div");
    input.className =
      "p-2 pr-6 outline-none flex flex-wrap gap-1 overflow-y-auto border border-black-200 focus:border-success-500 bg-grey-200 rounded-md font-light text-sm w-full md:w-96 min-h-9 h-fit relative";
    input.tabIndex = 0;
    input.textContent = placeholder;
    input.setAttribute("role", "listbox");
    input.setAttribute("aria-multiselectable", "true");
    input.setAttribute("aria-expanded", "false");
    input.setAttribute("aria-haspopup", "listbox");

    inputContainer.appendChild(input);

    const dropdown = document.createElement("div");
    dropdown.className =
      "absolute top-full mt-1 left-0 bg-white border border-black-200 rounded-md shadow-md max-h-36 overflow-y-auto overscroll-contain hidden w-full md:w-96 z-20";

    inputContainer.appendChild(dropdown);

    const clearAllButton = document.createElement("button");
    clearAllButton.type = "button";
    clearAllButton.appendChild(this.generateCloseIcon());
    clearAllButton.className =
      "flex items-center h-full px-1 text-sm text-gray-500 cursor-pointer border-l border-black-200 bg-transparent focus:outline-none absolute top-0 right-0";

    clearAllButton.addEventListener("click", (event) => {
      event.preventDefault();
      selectedOptions.clear();
      updateSelectedOptions();
      updateDropdownOptions();
      input.textContent = placeholder;
    });

    inputContainer.appendChild(clearAllButton);

    container.appendChild(inputContainer);

    const updateDropdownOptions = () => {
      const allOptionsSelected = options.every((option) =>
        selectedOptions.has(option.value)
      );

      removeAllChildren(dropdown);

      if (allOptionsSelected || options.length === 0) {
        const placeholderOption = document.createElement("div");
        placeholderOption.className =
          "py-1 px-2 cursor-pointer text-grey-900 font-light text-sm rounded m-2 border border-dashed";
        placeholderOption.textContent = allOptionsSelected
          ? "All Options Selected"
          : "No options available";
        dropdown.appendChild(placeholderOption);
      } else {
        options.forEach((option) => {
          if (!selectedOptions.has(option.value)) {
            const optionElement = document.createElement("div");
            optionElement.className =
              "p-2 cursor-pointer hover:bg-gray-100 text-sm";
            optionElement.textContent = option.label;

            optionElement.addEventListener("click", () => {
              selectedOptions.add(option.value);
              updateSelectedOptions();
              updateDropdownOptions();
            });

            dropdown.appendChild(optionElement);
          }
        });
      }
    };

    input.addEventListener("click", () => {
      dropdown.classList.remove("hidden");
      updateDropdownOptions();
    });

    document.addEventListener("click", (event) => {
      if (!container.contains(event.target)) {
        dropdown.classList.add("hidden");
      }
    });

    const updateSelectedOptions = () => {
      removeAllChildren(input);

      if (selectedOptions.size === 0) {
        input.textContent = placeholder;
      } else {
        selectedOptions.forEach((value) => {
          const selectedOption = document.createElement("span");
          selectedOption.className =
            "flex items-center h-fit selected-option px-2 cursor-pointer rounded bg-grey-600 text-grey-900 rounded-sm";
          selectedOption.textContent = options.find(
            (opt) => opt.value === value
          ).label;

          const clearButton = document.createElement("button");
          clearButton.appendChild(this.generateCloseIcon());
          clearButton.className =
            "ml-2 p-1 text-sm text-gray-500 cursor-pointer border-none bg-transparent focus:outline-none";

          clearButton.addEventListener("click", () => {
            selectedOptions.delete(value);
            updateSelectedOptions();
            updateDropdownOptions();
          });

          selectedOption.appendChild(clearButton);
          input.appendChild(selectedOption);
        });
      }
    };

    options.forEach((option) => {
      const optionElement = document.createElement("div");
      optionElement.className = "p-2 cursor-pointer hover:bg-gray-100";
      optionElement.textContent = option.label;

      optionElement.addEventListener("click", () => {
        selectedOptions.add(option.value);
        updateSelectedOptions();
        updateDropdownOptions();
      });

      dropdown.appendChild(optionElement);
    });

    return container;
  }

  async renderFacultyOptions(electionFacultySelect) {
    const faculties = await this.fetchFaculties();
    this.loading = false;

    const allOptions = faculties.map((faculty) => faculty.faculty_id);
    const allOption = document.createElement("option");
    allOption.textContent = "All";
    allOption.value = allOptions;

    const facultyOptions = faculties.map(function (faculty) {
      const option = document.createElement("option");
      option.textContent = faculty.faculty_name;
      option.value = faculty.faculty_id;
      return option;
    });

    electionFacultySelect.append(allOption, ...facultyOptions);
  }

  async renderContent() {
    const pageLoader = this.renderPageLoader();
    if (!this.role) return pageLoader;

    const layout = await this.renderProtectedLayout();
    const loader = this.renderLoader();
    const contentArea = layout.querySelector("#content-area");
    const contentHeader = document.createElement("header");
    contentHeader.className = "flex justify-center h-fit";

    const dataContainer = document.createElement("div");
    dataContainer.id = "data-container";
    dataContainer.className = "w-full h-full mt-2 overflow-y-auto";

    const viewHeading = document.createElement("h2");
    viewHeading.className = "text-lg font-semibold capitalize";
    viewHeading.textContent = "Create election";

    contentHeader.appendChild(viewHeading);
    const electionForm = document.createElement("form");
    electionForm.className = "flex flex-col items-center h-fit gap-y-2";

    const electionTitleInput = document.createElement("input");
    electionTitleInput.className =
      "p-2 outline-none border border-black-200 focus:border-success-500 bg-grey-200 rounded-md font-light text-sm w-full md:w-96";
    electionTitleInput.type = "text";
    electionTitleInput.name = "election_title";
    electionTitleInput.id = "election_title";
    electionTitleInput.placeholder = "Enter title here";

    const electionTitleError = document.createElement("p");
    electionTitleError.id = "election_title_error";
    electionTitleError.className =
      "text-xs font-light text-danger-500 invisible";

    const electionDescriptionTextarea = document.createElement("textarea");
    electionDescriptionTextarea.className =
      "p-2 outline-none border border-black-200 focus:border-success-500 bg-grey-200 rounded-md font-light text-sm w-full max-w-96 resize-none";

    electionDescriptionTextarea.name = "election_description";
    electionDescriptionTextarea.id = "election_description";
    electionDescriptionTextarea.placeholder = "Describe the election";
    electionDescriptionTextarea.setAttribute("rows", "4");

    const electionDescriptionError = document.createElement("p");
    electionDescriptionError.id = "election_description_error";
    electionDescriptionError.className =
      "text-xs font-light text-danger-500 invisible";

    const electionFacultySelect = document.createElement("select");
    electionFacultySelect.className =
      "p-2 outline-none border border-black-200 focus:border-success-500 bg-grey-200 rounded-md font-light text-sm w-full md:w-96";
    electionFacultySelect.name = "election_faculty";
    electionFacultySelect.id = "election_faculty";

    const defaultFacultyOption = document.createElement("option");
    defaultFacultyOption.textContent = "-- Select Faculty --";
    defaultFacultyOption.value = "";
    defaultFacultyOption.disabled = true;
    defaultFacultyOption.selected = true;

    removeAllChildren(electionFacultySelect);
    electionFacultySelect.appendChild(defaultFacultyOption);
    this.renderFacultyOptions(electionFacultySelect);

    const electionFacultySelectError = document.createElement("p");
    electionFacultySelectError.id = "election_description_error";
    electionFacultySelectError.className =
      "text-xs font-light text-danger-500 invisible";

    const electionFacultyDepartmentSelect = document.createElement("select");
    electionFacultyDepartmentSelect.className =
      "p-2 outline-none border border-black-200 focus:border-success-500 bg-grey-200 rounded-md font-light text-sm w-full md:w-96";
    electionFacultyDepartmentSelect.name = "election_faculty";
    electionFacultyDepartmentSelect.id = "election_faculty";

    const defaultFacultyDepartmentSelectOption =
      document.createElement("option");
    defaultFacultyDepartmentSelectOption.textContent =
      "-- Select Department --";
    defaultFacultyDepartmentSelectOption.value = "";
    defaultFacultyDepartmentSelectOption.disabled = true;
    defaultFacultyDepartmentSelectOption.selected = true;

    removeAllChildren(electionFacultyDepartmentSelect);
    electionFacultyDepartmentSelect.appendChild(
      defaultFacultyDepartmentSelectOption
    );

    const electionFacultyDepartmentSelectError = document.createElement("p");
    electionFacultyDepartmentSelectError.id = "election_description_error";
    electionFacultyDepartmentSelectError.className =
      "text-xs font-light text-danger-500 invisible";

    const yearOptions = [
      { label: "1", value: 1 },
      { label: "2", value: 2 },
      { label: "3", value: 3 },
      { label: "4", value: 4 },
    ];
    const electionYearOptionsSelect = this.createSelectInput(
      yearOptions,
      "-- Select Years of Study --"
    );

    const electionYearOptionsSelectError = document.createElement("p");
    electionYearOptionsSelectError.id = "election_year_options_select_error";
    electionYearOptionsSelectError.className =
      "text-xs font-light text-danger-500 invisible";

    const semesterOptions = [
      { label: "First", value: 1 },
      { label: "Second", value: 2 },
    ];
    const electionSemesterOptionsSelect = this.createSelectInput(
      semesterOptions,
      "-- Select Semesters --"
    );

    const electionSemesterOptionsSelectError = document.createElement("p");
    electionSemesterOptionsSelectError.id =
      "election_semester_options_select_error";
    electionSemesterOptionsSelectError.className =
      "text-xs font-light text-danger-500 invisible";

    const electionPositionOptions = [
      { label: "Class Representatives", value: "Class Representatives" },
      { label: "Guild President", value: "Guild President" },
      { label: "CGC Chairperson", value: "CGC Chairperson" },
      { label: "College Guild Council", value: "College Guild Council" },
      { label: "GRC Schools", value: "GRC Schools" },
      { label: "GRC Halls", value: "GRC Halls" },
      { label: "GRC Disablity", value: "GRC Disablity" },
      { label: "GRC Tribunal", value: "GRC Tribunal" },
      { label: "Games Union School", value: "Games Union School" },
      { label: "Students Debating Union", value: "Students Debating Union" },
      { label: "SCR Chairperson", value: "SCR Chairperson" },
      { label: "SCR Disciplinary", value: "SCR Discriplinary" },
      { label: "SCR Entertainment", value: "SCR Entertainment" },
      { label: "SCR Finance Secretary", value: "SCR Finance Secretary" },
      { label: "SCR General Secretary", value: "SCR General Secretary" },
      { label: "SCR Health Secretary", value: "SCR Health Secretary" },
    ];
    const electionPositionOptionsSelect = this.createSelectInput(
      electionPositionOptions,
      "-- Select Positions --"
    );

    const electionPositionOptionsSelectError = document.createElement("p");
    electionPositionOptionsSelectError.id =
      "election_position_options_select_error";
    electionPositionOptionsSelectError.className =
      "text-xs font-light text-danger-500 invisible";

    const electionStartDateInput = document.createElement("input");
    electionStartDateInput.className =
      "p-2 outline-none border border-black-200 focus:border-success-500 bg-grey-200 rounded-md font-light text-sm w-full md:w-96";
    electionStartDateInput.type = "date";
    electionStartDateInput.name = "election_start_date";
    electionStartDateInput.id = "election_start_date";

    const electionStartDateError = document.createElement("p");
    electionStartDateError.id = "election_start_date_error";
    electionStartDateError.className =
      "text-xs font-light text-danger-500 invisible";

    const electionEndDateInput = document.createElement("input");
    electionEndDateInput.className =
      "p-2 outline-none border border-black-200 focus:border-success-500 bg-grey-200 rounded-md font-light text-sm w-full md:w-96";
    electionEndDateInput.type = "date";
    electionEndDateInput.name = "election_end_date";
    electionEndDateInput.id = "election_end_date";

    const electionEndDateError = document.createElement("p");
    electionEndDateError.id = "election_end_date_error";
    electionEndDateError.className =
      "text-xs font-light text-danger-500 invisible";

    const setElectionButton = document.createElement("button");
    setElectionButton.className =
      "w-full md:w-96 p-2 font-medium rounded-md text-grey-100 bg-success-500 hover:bg-popup-100 hover:text-popup-600 hover:cursor-pointer disabled:cursor-normal";
    setElectionButton.id = "set-election-cta";
    setElectionButton.type = "button";
    setElectionButton.textContent = "Set Election";
    setElectionButton.disabled = this.formState.isSubmitting;

    electionForm.append(
      electionTitleInput,
      electionTitleError,
      electionDescriptionTextarea,
      electionDescriptionError,
      electionFacultySelect,
      electionFacultySelectError,
      electionFacultyDepartmentSelect,
      electionFacultyDepartmentSelectError,
      electionYearOptionsSelect,
      electionYearOptionsSelectError,
      electionSemesterOptionsSelect,
      electionSemesterOptionsSelectError,
      electionPositionOptionsSelect,
      electionPositionOptionsSelectError,
      electionStartDateInput,
      electionStartDateError,
      electionEndDateInput,
      electionEndDateError,
      setElectionButton
    );

    dataContainer.appendChild(electionForm);
    contentArea.appendChild(contentHeader);
    contentArea.appendChild(dataContainer);

    return layout;
  }
}
