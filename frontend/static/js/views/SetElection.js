import AbstractView from "./AbstractView.js";
import { supabaseClient, removeAllChildren } from "../index.js";

const ELEMENT_IDS = {
  ELECTION_TITLE_INPUT: "election_title",
  ELECTION_DESCRIPTION_INPUT: "election_description",
  ELECTION_FACULTY_SELECT: "election_faculty",
  ELECTION_DEPARTMENT_SELECT: "election_department",
  ELECTION_YEAR_SELECT: "election_years",
  ELECTION_SEMESTER_SELECT: "election_semesters",
  ELECTION_POSITION_SELECT: "election_positions",
  ELECTION_START_DATE_INPUT: "election_start_date",
  ELECTION_END_DATE_INPUT: "election_end_date",
  ELECTION_START_TIME_INPUT: "election_start_time",
  ELECTION_END_TIME_INPUT: "election_end_time",
  ELECTION_APPLICATION_OPEN_DATE_INPUT: "election_application_open_date",
  ELECTION_APPLICATION_CLOSE_DATE_INPUT: "election_application_close_date",
  SET_ELECTION_BUTTON: "set-election-cta",
};
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

    // Default form options.
    this.electionPositions = [];
    this.facultyOptions = [];
    this.semesterOptions = [];
    this.yearOptions = [];

    // Default form state
    this.formState = {
      election_title: "",
      election_description: "",
      election_faculty: "",
      election_department: "",
      election_years: [],
      election_semesters: [],
      election_positions: [],
      election_start_date: "",
      election_end_date: "",
      election_start_time: "",
      election_end_time: "",
      election_application_open_date: "",
      election_application_close_date: "",
      errors: {},
      touched: {},
      isSubmitting: false,
    };

    this.validationSchema = {
      election_title: [
        (value) => (value.trim().length === 0 ? "Title is required" : ""),
        (value) =>
          value.length > 50 ? "Title must be 50 characters or less" : "",
        (value) =>
          value.length < 3 ? "Title must be at least 3 characters" : "",
      ],
      election_description: [
        (value) => (value.trim().length === 0 ? "Description is required" : ""),
        (value) =>
          value.length > 500
            ? "Description must be 500 characters or less"
            : "",
        (value) =>
          value.length < 10 ? "Description must be at least 10 characters" : "",
      ],
      election_faculty: [
        (value) => (value.trim().length === 0 ? "Faculty is required" : ""),
      ],
      election_department: [
        (value) => (value.trim().length === 0 ? "Department is required" : ""),
      ],
      election_years: [
        (value) => {
          return Array.isArray(value) && value.length === 0
            ? "Select at least one Year of Study"
            : "";
        },
      ],
      election_semesters: [
        (value) =>
          Array.isArray(value) && value.length === 0
            ? "Select at least semester"
            : "",
      ],
      election_positions: [
        (value) =>
          Array.isArray(value) && value.length === 0
            ? "Select at least one position"
            : "",
      ],
      election_start_date: [
        (value) => (value.trim().length === 0 ? "Start Date is required" : ""),
        (value) =>
          !/^\d{4}-\d{2}-\d{2}$/.test(value) ? "Invalid date format" : "",
      ],
      election_end_date: [
        (value) => (value.trim().length === 0 ? "End Date is required" : ""),
        (value) =>
          this.formState.election_start_date &&
          new Date(value) <= new Date(this.formState.election_start_date)
            ? "End Date must be after Start Date"
            : "",
      ],
      election_start_time: [
        (value) => (value.trim().length === 0 ? "Start Time is required" : ""),
      ],
      election_end_time: [
        (value) => (value.trim().length === 0 ? "End Time is required" : ""),
      ],
      election_application_open_date: [
        (value) =>
          value.trim().length === 0 ? "Application Open Date is required" : "",
        (value) =>
          !/^\d{4}-\d{2}-\d{2}$/.test(value) ? "Invalid date format" : "",
      ],
      election_application_close_date: [
        (value) =>
          value.trim().length === 0 ? "Application Close Date is required" : "",
        (value) =>
          this.formState.election_application_open_date &&
          new Date(value) <=
            new Date(this.formState.election_application_open_date)
            ? "Close Date must be after Open Date"
            : "",
      ],
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleInputBlur = this.handleInputBlur.bind(this);
  }

  handleInputChange(event) {
    const { name: fieldName, value } = event.target;
    this.formState[fieldName] = value;
    this.validateField(fieldName);
  }

  handleInputBlur(event) {
    const { name: fieldName } = event.target;
    this.formState.touched[fieldName] = true;
    this.validateField(fieldName);
  }

  validateField(fieldName) {
    if (this.formState.errors[fieldName]) {
      delete this.formState.errors[fieldName];
    }

    for (const checkValidity of this.validationSchema[fieldName]) {
      const errorMessage = checkValidity(this.formState[fieldName]);
      if (errorMessage) {
        this.formState.errors[fieldName] = errorMessage;
        break;
      }
    }

    this.updateAriaInvalid(fieldName);
    this.showHideError(fieldName);
  }

  hasErrorAndTouched(fieldName) {
    return (
      (this.formState.errors[fieldName] && this.formState.touched[fieldName]) ||
      false
    );
  }

  updateAriaInvalid(fieldName) {
    const hasErrorAndTouched = this.hasErrorAndTouched(fieldName);
    const inputElement = document.getElementById(fieldName);
    if (hasErrorAndTouched) {
      inputElement.classList.add(
        "focus:border-danger-500",
        "border-danger-500"
      );
      inputElement.classList.remove(
        "focus:border-success-500",
        "border-black-200"
      );
      return;
    }

    if (!hasErrorAndTouched) {
      inputElement.classList.add(
        "focus:border-success-500",
        "border-black-200"
      );
      inputElement.classList.remove(
        "focus:border-danger-500",
        "border-danger-500"
      );
    }
  }

  showHideError(fieldName) {
    const errorElement = document.getElementById(`${fieldName}_error`);
    const hasErrorAndTouched = this.hasErrorAndTouched(fieldName);

    if (hasErrorAndTouched) {
      errorElement.textContent = this.formState.errors[fieldName];
      errorElement.classList.remove("invisible");
      return;
    }

    errorElement.classList.add("invisible");
    errorElement.textContent = null;
  }

  renderElectionForm() {
    const electionForm = document.createElement("form");
    electionForm.className = "flex flex-col items-center h-fit gap-y-2 pb-10";
    electionForm.id = "election-form";

    // Title form field
    const electionTitleFormField = this.createFieldContainer();
    const electionTitleFormFieldLabel = this.createFieldLabel(
      ELEMENT_IDS.ELECTION_TITLE_INPUT,
      "Title"
    );
    const electionTitleInput = this.createInputField(
      "text",
      ELEMENT_IDS.ELECTION_TITLE_INPUT,
      "Enter title here"
    );
    const electionTitleError = this.createErrorElement(
      ELEMENT_IDS.ELECTION_TITLE_INPUT
    );
    electionTitleFormField.append(
      electionTitleFormFieldLabel,
      electionTitleInput,
      electionTitleError
    );

    // Description form field
    const electionDescriptionFormField = this.createFieldContainer();
    const electionDescriptionFormFieldLabel = this.createFieldLabel(
      ELEMENT_IDS.ELECTION_DESCRIPTION_INPUT,
      "Description"
    );
    const electionDescriptionTextarea = this.createInputField(
      "textarea",
      ELEMENT_IDS.ELECTION_DESCRIPTION_INPUT,
      "Describe the election"
    );

    const electionDescriptionError = this.createErrorElement(
      ELEMENT_IDS.ELECTION_DESCRIPTION_INPUT
    );
    electionDescriptionFormField.append(
      electionDescriptionFormFieldLabel,
      electionDescriptionTextarea,
      electionDescriptionError
    );

    // Faculty Form Field
    const electionFacultyFormField = this.createFieldContainer();
    const electionFacultyFormFieldLabel = this.createFieldLabel(
      ELEMENT_IDS.ELECTION_FACULTY_SELECT,
      "Faculty"
    );
    const electionFacultySelect = this.createSelectField(
      ELEMENT_IDS.ELECTION_FACULTY_SELECT,
      "-- Select Faculty --"
    );

    // Fetching the faculty options
    // this.renderFacultyOptions(electionFacultySelect);
    const electionFacultySelectError = this.createErrorElement(
      ELEMENT_IDS.ELECTION_FACULTY_SELECT
    );
    electionFacultyFormField.append(
      electionFacultyFormFieldLabel,
      electionFacultySelect,
      electionFacultySelectError
    );

    // Faculty department form field
    const electionFacultyDepartmentFormField = this.createFieldContainer();
    const electionFacultyDepartmentFormFieldLabel = this.createFieldLabel(
      ELEMENT_IDS.ELECTION_FACULTY_SELECT,
      "Department"
    );

    const electionFacultyDepartmentSelect = this.createSelectField(
      ELEMENT_IDS.ELECTION_DEPARTMENT_SELECT,
      "-- Select Department --"
    );

    const electionFacultyDepartmentSelectError = this.createErrorElement(
      ELEMENT_IDS.ELECTION_DEPARTMENT_SELECT
    );

    electionFacultyDepartmentFormField.append(
      electionFacultyDepartmentFormFieldLabel,
      electionFacultyDepartmentSelect,
      electionFacultyDepartmentSelectError
    );

    // Year of study form field select
    const electionYearOptionsFormField = this.createFieldContainer();
    const electionYearOptionsFormFieldLabel = this.createFieldLabel(
      ELEMENT_IDS.ELECTION_YEAR_SELECT,
      "Years of Study"
    );

    const electionYearOptionsSelect = this.createMultiSelectInput(
      this.yearOptions,
      "-- Select Years of Study --",
      ELEMENT_IDS.ELECTION_YEAR_SELECT,
      this.updateFormState.bind(this),
      this.validateField.bind(this),
      this.setFieldTouched.bind(this)
    );

    const electionYearOptionsSelectError = this.createErrorElement(
      ELEMENT_IDS.ELECTION_YEAR_SELECT
    );

    electionYearOptionsFormField.append(
      electionYearOptionsFormFieldLabel,
      electionYearOptionsSelect,
      electionYearOptionsSelectError
    );

    // Semester options form field select
    const electionSemesterOptionsFormField = this.createFieldContainer();
    const electionSemesterOptionsFormFieldLabel = this.createFieldLabel(
      ELEMENT_IDS.ELECTION_SEMESTER_SELECT,
      "Semeters"
    );

    const electionSemesterOptionsSelect = this.createMultiSelectInput(
      this.semesterOptions,
      "-- Select Semesters --",
      ELEMENT_IDS.ELECTION_SEMESTER_SELECT,
      this.updateFormState.bind(this),
      this.validateField.bind(this),
      this.setFieldTouched.bind(this)
    );
    const electionSemesterOptionsSelectError = this.createErrorElement(
      ELEMENT_IDS.ELECTION_SEMESTER_SELECT
    );
    electionSemesterOptionsFormField.append(
      electionSemesterOptionsFormFieldLabel,
      electionSemesterOptionsSelect,
      electionSemesterOptionsSelectError
    );

    // Position options form field select
    const electionPositionOptionsFormField = this.createFieldContainer();
    const electionPositionOptionsFormFieldLabel = this.createFieldLabel(
      ELEMENT_IDS.ELECTION_POSITION_SELECT,
      "Positions"
    );

    const electionPositionOptionsSelect = this.createMultiSelectInput(
      this.electionPositions,
      "-- Select Positions --",
      ELEMENT_IDS.ELECTION_POSITION_SELECT,
      this.updateFormState.bind(this),
      this.validateField.bind(this),
      this.setFieldTouched.bind(this)
    );

    const electionPositionOptionsSelectError = this.createErrorElement(
      ELEMENT_IDS.ELECTION_POSITION_SELECT
    );
    electionPositionOptionsFormField.append(
      electionPositionOptionsFormFieldLabel,
      electionPositionOptionsSelect,
      electionPositionOptionsSelectError
    );

    // Start Date form field
    const electionStartDateFormField = this.createFieldContainer();
    const electionStartDateFormFieldLabel = this.createFieldLabel(
      ELEMENT_IDS.ELECTION_START_DATE_INPUT,
      "Start Date"
    );
    const electionStartDateInput = this.createInputField(
      "date",
      ELEMENT_IDS.ELECTION_START_DATE_INPUT,
      null
    );
    electionStartDateInput.addEventListener("input", (event) => {
      this.handleInputChange(event);
      this.validateField(ELEMENT_IDS.ELECTION_END_DATE_INPUT);
    });

    const electionStartDateError = this.createErrorElement(
      ELEMENT_IDS.ELECTION_START_DATE_INPUT
    );
    electionStartDateFormField.append(
      electionStartDateFormFieldLabel,
      electionStartDateInput,
      electionStartDateError
    );

    // End Date form field
    const electionEndDateFormField = this.createFieldContainer();
    const electionEndDateFormFieldLabel = this.createFieldLabel(
      ELEMENT_IDS.ELECTION_END_DATE_INPUT,
      "End Date"
    );
    const electionEndDateInput = this.createInputField(
      "date",
      ELEMENT_IDS.ELECTION_END_DATE_INPUT,
      null
    );
    electionEndDateInput.addEventListener("input", (event) => {
      this.handleInputChange(event);
      this.validateField(ELEMENT_IDS.ELECTION_START_DATE_INPUT);
    });

    const electionEndDateError = this.createErrorElement(
      ELEMENT_IDS.ELECTION_END_DATE_INPUT
    );
    electionEndDateFormField.append(
      electionEndDateFormFieldLabel,
      electionEndDateInput,
      electionEndDateError
    );

    // Application Open form field
    const electionApplicationOpenDateFormField = this.createFieldContainer();
    const electionApplicationOpenDateFormFieldLabel = this.createFieldLabel(
      ELEMENT_IDS.ELECTION_APPLICATION_OPEN_DATE_INPUT,
      "Application Open Date"
    );
    const electionApplicationOpenDateInput = this.createInputField(
      "date",
      ELEMENT_IDS.ELECTION_APPLICATION_OPEN_DATE_INPUT,
      null
    );
    electionApplicationOpenDateInput.addEventListener("input", (event) => {
      this.handleInputChange(event);
      this.validateField(ELEMENT_IDS.ELECTION_APPLICATION_CLOSE_DATE_INPUT);
    });

    const electionApplicationOpenDateError = this.createErrorElement(
      ELEMENT_IDS.ELECTION_APPLICATION_OPEN_DATE_INPUT
    );
    electionApplicationOpenDateFormField.append(
      electionApplicationOpenDateFormFieldLabel,
      electionApplicationOpenDateInput,
      electionApplicationOpenDateError
    );

    // Application Close form field
    const electionApplicationCloseDateFormField = this.createFieldContainer();
    const electionApplicationCloseDateFormFieldLabel = this.createFieldLabel(
      ELEMENT_IDS.ELECTION_APPLICATION_CLOSE_DATE_INPUT,
      "Application Close Date"
    );
    const electionApplicationCloseDateInput = this.createInputField(
      "date",
      ELEMENT_IDS.ELECTION_APPLICATION_CLOSE_DATE_INPUT,
      null
    );
    electionApplicationCloseDateInput.addEventListener("input", (event) => {
      this.handleInputChange(event);
      this.validateField(ELEMENT_IDS.ELECTION_APPLICATION_OPEN_DATE_INPUT);
    });

    const electionApplicationCloseDateError = this.createErrorElement(
      ELEMENT_IDS.ELECTION_APPLICATION_CLOSE_DATE_INPUT
    );
    electionApplicationCloseDateFormField.append(
      electionApplicationCloseDateFormFieldLabel,
      electionApplicationCloseDateInput,
      electionApplicationCloseDateError
    );

    // Start Time Field
    const electionStartTimeFormField = this.createFieldContainer();
    const electionStartTimeFormFieldLabel = this.createFieldLabel(
      ELEMENT_IDS.ELECTION_START_TIME_INPUT,
      "Start Time"
    );
    const electionStartTimeInput = this.createInputField(
      "time",
      ELEMENT_IDS.ELECTION_START_TIME_INPUT,
      null
    );

    const electionStartTimeError = this.createErrorElement(
      ELEMENT_IDS.ELECTION_START_TIME_INPUT
    );
    electionStartTimeFormField.append(
      electionStartTimeFormFieldLabel,
      electionStartTimeInput,
      electionStartTimeError
    );

    // End Time Field
    const electionEndTimeFormField = this.createFieldContainer();
    const electionEndTimeFormFieldLabel = this.createFieldLabel(
      ELEMENT_IDS.ELECTION_END_TIME_INPUT,
      "End Time"
    );
    const electionEndTimeInput = this.createInputField(
      "time",
      ELEMENT_IDS.ELECTION_END_TIME_INPUT,
      null
    );

    const electionEndTimeError = this.createErrorElement(
      ELEMENT_IDS.ELECTION_END_TIME_INPUT
    );
    electionEndTimeFormField.append(
      electionEndTimeFormFieldLabel,
      electionEndTimeInput,
      electionEndTimeError
    );

    const setElectionButton = document.createElement("button");
    setElectionButton.className =
      "w-full md:w-96 p-2 font-medium rounded-md text-grey-100 bg-success-500 hover:bg-popup-100 hover:text-popup-600 hover:cursor-pointer disabled:cursor-normal";
    setElectionButton.id = "set-election-cta";
    setElectionButton.type = "button";
    setElectionButton.textContent = "Set Election";
    setElectionButton.disabled = this.formState.isSubmitting;

    setElectionButton.addEventListener("click", async (event) => {
      event.preventDefault();
      this.isSubmitting = true;

      // validate all fields
      Object.keys(this.validationSchema).forEach((fieldName) => {
        this.setFieldTouched(fieldName);
        this.validateField(fieldName);
      });

      const hasErrors = Object.values(this.formState.errors).some(
        (error) => error.length > 1
      );

      if (!hasErrors) {
        const {
          election_title,
          election_description,
          election_application_open_date,
          election_application_close_date,
          election_start_date,
          election_end_date,
          election_start_time,
          election_end_time,
          election_faculty,
          election_department,
          election_years,
          election_positions,
          election_semesters,
        } = this.formState;

        const formatted_start_date = this.parseDateTime(
          election_start_date,
          election_start_time
        );
        const formatted_end_date = this.parseDateTime(
          election_end_date,
          election_end_time
        );
        const formatted_application_open_date = this.parseDateTime(
          election_application_open_date,
          election_start_time
        );
        const formatted_application_close_date = this.parseDateTime(
          election_application_close_date,
          election_end_time
        );

        // Create the election
        const {
          data: { election_id },
          error,
        } = await supabaseClient
          .from("elections")
          .insert({
            election_title,
            election_description,
            election_application_open_date: formatted_application_open_date,
            election_application_close_date: formatted_application_close_date,
            election_start_date: formatted_start_date,
            election_end_date: formatted_end_date,
            created_by: this.profile.user_id,
          })
          .select()
          .single();

        if (error) {
          console.log("Error: ", JSON.stringify(error, null, 2));
          this.showToast(error.message, "error");
          this.resetFormValues();
          return;
        }

        if (election_id) {
          await Promise.all([
            this.createElectionFaculties(
              election_id,
              election_faculty.split(",")
            ),
            this.createElectionDepartments(
              election_id,
              election_department.split(",")
            ),
            this.createElectionPosts(election_id, election_positions),
            this.createElectionYears(election_id, election_years),
            this.createElectionSemesters(election_id, election_semesters),
          ]);

          this.showToast("Successfully created election", "success");
          this.resetFormValues();
          return;
        }
      }
    });

    electionForm.append(
      electionTitleFormField,
      electionDescriptionFormField,
      electionFacultyFormField,
      electionFacultyDepartmentFormField,
      electionYearOptionsFormField,
      electionSemesterOptionsFormField,
      electionPositionOptionsFormField,
      electionApplicationOpenDateFormField,
      electionApplicationCloseDateFormField,
      electionStartDateFormField,
      electionEndDateFormField,
      electionStartTimeFormField,
      electionEndTimeFormField,
      setElectionButton
    );

    return electionForm;
  }

  async createElectionFaculties(election_id, faculties_ids) {
    const electionFacultyRecords = faculties_ids.map((faculty_id) => ({
      faculty_id,
      election_id,
    }));
    const { data, error } = await supabaseClient
      .from("election_faculties")
      .insert(electionFacultyRecords)
      .select();

    if (error) throw error;
    return data;
  }

  async createElectionDepartments(election_id, department_ids) {
    const electionDepartmentRecords = department_ids.map((department_id) => ({
      election_id,
      department_id,
    }));

    const { data, error } = await supabaseClient
      .from("election_departments")
      .insert(electionDepartmentRecords)
      .select();

    if (error) throw error;
    return data;
  }

  async createElectionPosts(election_id, post_ids) {
    const electionPostRecords = post_ids.map((post_id) => ({
      election_id,
      post_id,
    }));

    const { data, error } = await supabaseClient
      .from("election_posts")
      .insert(electionPostRecords)
      .select();

    if (error) throw error;
    return data;
  }

  async createElectionYears(election_id, years_ids) {
    const electionYearRecords = years_ids.map((year_id) => ({
      election_id,
      year_id,
    }));

    const { data, error } = await supabaseClient
      .from("election_years")
      .insert(electionYearRecords)
      .select();

    if (error) throw error;
    return data;
  }

  async createElectionSemesters(election_id, semester_ids) {
    const electionSemesterRecords = semester_ids.map((semester_id) => ({
      election_id,
      semester_id,
    }));

    const { data, error } = await supabaseClient
      .from("election_semesters")
      .insert(electionSemesterRecords)
      .select();

    if (error) throw error;
    return data;
  }

  parseDateTime(dateValue, timeValue) {
    const dateTimeString = `${dateValue}T${timeValue}`;
    const date = new Date(dateTimeString);
    date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
    return date.toISOString();
  }

  async fetchFormOptions() {
    this.isFetching = true;

    const [electionPositions, facultyOptions, yearOptions, semesterOptions] =
      await Promise.all([
        this.fetchPositions(),
        this.fetchFaculties(),
        this.fetchYears(),
        this.fetchSemesters(),
      ]);

    this.electionPositions = electionPositions.map(({ post_id, post }) => {
      return { label: post, value: post_id };
    });

    this.facultyOptions = facultyOptions;

    this.yearOptions = yearOptions.map(({ year_id, year_value }) => {
      return { label: year_value, value: year_id };
    });

    this.semesterOptions = semesterOptions.map(
      ({ semester_id, semester_label }) => {
        return { label: semester_label, value: semester_id };
      }
    );

    const dataContainer = document.querySelector("#data-container");
    const dataLoaderContainer = document.querySelector(
      "#data-loader-container"
    );

    if (dataLoaderContainer) {
      const previousElectionForm = document.querySelector("#election-form");
      dataContainer.removeChild(previousElectionForm);
      dataContainer.removeChild(dataLoaderContainer);

      const electionForm = this.renderElectionForm();
      const electionFacultySelect =
        electionForm.querySelector("#election_faculty");
      this.renderFacultyOptions(electionFacultySelect);
      dataContainer.appendChild(electionForm);
    }

    this.isFetching = false;
  }

  async fetchFaculties() {
    const { data } = await supabaseClient.from("faculties").select(`
        faculty_id,
        faculty_name,
        departments(
          department_id,
          department_name
        )
      `);
    return data;
  }

  async fetchPositions() {
    const { data } = await supabaseClient.from("posts").select();
    return data;
  }

  async fetchSemesters() {
    const { data } = await supabaseClient.from("semesters").select();
    return data;
  }

  async fetchYears() {
    const { data } = await supabaseClient
      .from("years")
      .select()
      .order("year_value", { ascending: true });
    return data;
  }

  async renderFacultyOptions(electionFacultySelect) {
    const allOptions = this.facultyOptions
      .map((faculty) => faculty.faculty_id)
      .join(",");
    const allOption = document.createElement("option");
    allOption.textContent = "All";
    allOption.value = allOptions;

    const facultyOptions = this.facultyOptions.map(function (faculty) {
      const option = document.createElement("option");
      option.textContent = faculty.faculty_name;
      option.value = faculty.faculty_id;
      return option;
    });

    electionFacultySelect.addEventListener("change", (event) => {
      const { name: fieldName, value } = event.target;
      this.formState[fieldName] = value;
      this.validateField(fieldName);

      const selectedFacultyOptions = value.split(",");
      const facultyDepartments = this.facultyOptions
        .filter((faculty) =>
          selectedFacultyOptions.includes(faculty.faculty_id)
        )
        .flatMap((faculty) => faculty.departments);

      const allOptions = facultyDepartments
        .map((department) => department.department_id)
        .join(",");

      const allOption = document.createElement("option");
      allOption.textContent = "All";
      allOption.value = allOptions;

      const departmentOptions = facultyDepartments.map(function (department) {
        const option = document.createElement("option");
        option.textContent = department.department_name;
        option.value = department.department_id;
        return option;
      });

      const electionDepartmentSelect = document.getElementById(
        ELEMENT_IDS.ELECTION_DEPARTMENT_SELECT
      );
      removeAllChildren(electionDepartmentSelect);
      const defaultOption = document.createElement("option");
      defaultOption.textContent = "-- Select Department --";
      defaultOption.disabled = true;
      defaultOption.selected = true;
      defaultOption.value = "";
      electionDepartmentSelect.append(
        defaultOption,
        allOption,
        ...departmentOptions
      );
    });

    electionFacultySelect.append(allOption, ...facultyOptions);
  }

  async renderContent() {
    const pageLoader = this.renderPageLoader();
    if (!this.role) return pageLoader;

    const layout = await this.renderProtectedLayout();
    const loader = this.renderLoader();

    const loaderContainer = document.createElement("div");
    loaderContainer.className =
      "flex justify-center h-full w-full items-center absolute";
    loaderContainer.appendChild(loader);
    loaderContainer.id = "data-loader-container";

    const contentArea = layout.querySelector("#content-area");

    const contentHeader = document.createElement("header");
    contentHeader.className = "flex justify-center h-fit";

    const dataContainer = document.createElement("div");
    dataContainer.id = "data-container";
    dataContainer.className = "w-full h-fit min-h-full relative pt-2";

    const viewHeading = document.createElement("h2");
    viewHeading.className = "text-lg font-semibold capitalize";
    viewHeading.textContent = "Create election";

    contentHeader.appendChild(viewHeading);
    const electionForm = this.renderElectionForm();

    this.fetchFormOptions();
    if (this.isFetching || this.loading)
      dataContainer.appendChild(loaderContainer);

    dataContainer.appendChild(electionForm);
    contentArea.appendChild(contentHeader);
    contentArea.appendChild(dataContainer);

    return layout;
  }

  createInputField(type, name, placeholder, rows = "4") {
    const inputElement = document.createElement(
      type === "textarea" ? "textarea" : "input"
    );
    inputElement.className = `p-2 outline-none border border-black-200 focus:border-success-500 bg-grey-200 rounded-md font-light text-sm w-full md:w-96`;
    inputElement.name = name;
    inputElement.id = name;

    inputElement.addEventListener("input", this.handleInputChange);
    inputElement.addEventListener("blur", this.handleInputBlur);

    if (placeholder) inputElement.placeholder = placeholder;

    if (type === "textarea") {
      inputElement.setAttribute("rows", rows);
      inputElement.classList.add("resize-none");
      return inputElement;
    }

    inputElement.type = type;
    return inputElement;
  }

  createSelectField(name, placeholder) {
    const selectElement = document.createElement("select");
    selectElement.className =
      "p-2 outline-none border border-black-200 focus:border-success-500 bg-grey-200 rounded-md font-light text-sm w-full md:w-96";
    selectElement.name = name;
    selectElement.id = name;
    selectElement.addEventListener("input", this.handleInputChange);
    selectElement.addEventListener("blur", this.handleInputBlur);

    const defaultOption = document.createElement("option");
    defaultOption.textContent = placeholder;
    defaultOption.value = "";
    defaultOption.disabled = true;
    defaultOption.selected = true;
    selectElement.appendChild(defaultOption);
    return selectElement;
  }

  createErrorElement(id) {
    const errorElement = document.createElement("p");
    errorElement.id = `${id}_error`;
    errorElement.className = "text-xs font-light text-danger-500 invisible";
    return errorElement;
  }

  createFieldContainer() {
    const fieldContainer = document.createElement("div");
    fieldContainer.className = "flex flex-col w-full md:w-96 gap-y-0.5";
    return fieldContainer;
  }

  createFieldLabel(fieldId, fieldText) {
    const fieldLabel = document.createElement("label");
    fieldLabel.className = "text-sm font-semibold";
    fieldLabel.textContent = fieldText;
    fieldLabel.htmlFor = fieldId;
    return fieldLabel;
  }

  updateFormState(id, value) {
    this.formState[id] = value;
  }

  setFieldTouched(fieldId) {
    this.formState.touched[fieldId] = true;
  }

  resetFormValues() {
    this.formState = {
      election_title: "",
      election_description: "",
      election_faculty: "",
      election_department: "",
      election_years: [],
      election_semesters: [],
      election_positions: [],
      election_start_date: "",
      election_end_date: "",
      election_start_time: "",
      election_end_time: "",
      election_application_open_date: "",
      election_application_close_date: "",
      errors: {},
      touched: {},
      isSubmitting: false,
    };
    
    const buttons = document.querySelectorAll(".multiselect-clear-all-button");
    buttons.forEach((button) => {
      button.click();
    });
    document.querySelector("#election-form").reset();
    return;
  }
}
