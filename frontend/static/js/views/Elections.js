import AbstractView from "./AbstractView.js";
import { supabaseClient, navigateTo, removeAllChildren } from "../index.js";
import { formatDate } from "../helpers/formatDate.js";
import { formatDateAndTime } from "../helpers/formatDateAndTime.js";
import { getRemainingTime } from "../helpers/updateCountdown.js";

export default class extends AbstractView {
  constructor(params) {
    super(params);
    this.setTitle("Elections");
    this.openNav = false;
    this.supabaseClient = supabaseClient;
    this.loading = false;
    this.isFetching = false;

    this.subscriptions = [];
    this.handleElectionsTableChanges =
      this.handleElectionsTableChanges.bind(this);
  }

  handleElectionsTableChanges(payload) {
    console.log("Election table changed: ", payload);
    this.renderElections(document.getElementById("data-container"));
  }

  createElectionsTable(headers, data) {
    const container = document.createElement("div");
    container.className =
      "w-full h-fit overflow-x-auto overscroll-contain rounded border-[0.5px]";

    const table = document.createElement("table");
    table.className =
      "w-full h-full border-collapse bg-grey-200 text-left divide-y-[0.5px]";

    const thead = document.createElement("thead");
    thead.className = "bg-grey-400";

    const headerRow = document.createElement("tr");
    const tableHeaders = headers.map(function (headerText) {
      const th = document.createElement("th");
      th.scope = "col";
      th.className = "px-4 py-2.5 font-light capitalize text-sm text-gray-700";
      th.textContent = headerText;
      return th;
    });

    headerRow.append(...tableHeaders);
    thead.appendChild(headerRow);
    table.appendChild(thead);

    const tbody = document.createElement("tbody");
    tbody.className = "divide-y border-gray-200";

    const dataRows = data.map((election) => {
      const tr = document.createElement("tr");
      tr.className = "hover:bg-grey-200 cursor-pointer h-fit";
      tr.addEventListener("click", () => {
        navigateTo(`/elections/${election.election_id}`);
      });

      const titleData = document.createElement("td");
      titleData.className = "px-4 py-2 text-black";

      const nameSpan = document.createElement("span");
      nameSpan.className = "text-sm font-light whitespace-nowrap";

      nameSpan.textContent = election.election_title;

      titleData.appendChild(nameSpan);

      tr.appendChild(titleData);

      const startDateData = document.createElement("td");
      startDateData.className = "px-4 py-2 font-body text-black";

      const startDateSpan = document.createElement("span");
      startDateSpan.className = "text-sm font-light whitespace-nowrap";
      startDateSpan.textContent = formatDate(election.election_start_date);

      startDateData.appendChild(startDateSpan);
      tr.appendChild(startDateData);

      const endDateData = document.createElement("td");
      endDateData.className = "px-4 py-2 text-black";

      const endDateSpan = document.createElement("span");
      endDateSpan.className = "text-sm font-light whitespace-nowrap";
      endDateSpan.textContent = formatDate(election.election_end_date);

      endDateData.appendChild(endDateSpan);
      tr.appendChild(endDateData);

      const actionsData = document.createElement("td");
      actionsData.className = "px-4 py-2";
      const actionsContainer = document.createElement("span");
      actionsContainer.className = "flex gap-x-2";

      const editButton = document.createElement("button");
      editButton.className =
        "p-1 group border-[0.5px] border-black-300 hover:border-black-600 hover:bg-black-100 rounded-lg";
      const editIcon = this.createEditIcon();
      editButton.appendChild(editIcon);
      editButton.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();
        this.handleElectionEdit(election.election_id);
      });

      const deleteButton = document.createElement("button");
      deleteButton.className =
        "p-1 group border-[0.5px] border-black-300 hover:border-danger-600 hover:bg-danger-100 rounded-lg";
      const deleteIcon = this.createDeleteIcon();
      deleteButton.appendChild(deleteIcon);
      deleteButton.addEventListener("click", async (event) => {
        event.preventDefault();
        event.stopPropagation();
        await this.handleElectionDelete(election.election_id);
      });

      actionsContainer.append(editButton, deleteButton);
      actionsData.appendChild(actionsContainer);
      tr.appendChild(actionsData);
      return tr;
    });

    tbody.append(...dataRows);
    table.appendChild(tbody);
    container.appendChild(table);
    return container;
  }

  handleElectionEdit(election_id) {
    navigateTo(`elections/${election_id}/edit`);
  }

  async handleElectionDelete(election_id) {
    const electionFacultyDeletionPromise = supabaseClient
      .from("election_faculties")
      .delete()
      .eq("election_id", election_id);

    const electionDepartmentDeletionPromise = supabaseClient
      .from("election_departments")
      .delete()
      .eq("election_id", election_id);

    const electionPostsDeletionPromise = supabaseClient
      .from("election_posts")
      .delete()
      .eq("election_id", election_id);

    const electionYearsDeletionPromise = supabaseClient
      .from("election_years")
      .delete()
      .eq("election_id", election_id);

    const electionSemestersDeletionPromise = supabaseClient
      .from("election_semesters")
      .delete()
      .eq("election_id", election_id);

    await Promise.all([
      electionFacultyDeletionPromise,
      electionDepartmentDeletionPromise,
      electionPostsDeletionPromise,
      electionYearsDeletionPromise,
      electionSemestersDeletionPromise,
    ]);

    const { error } = await supabaseClient
      .from("elections")
      .delete()
      .eq("election_id", election_id);

    if (error) {
      this.showToast(error.message, "error");
      return;
    }

    this.showToast("Successfully deleted election", "success");
    return;
  }

  async renderElections(dataContainer) {
    if (this.subscriptions.length > 0) {
      this.subscriptions.forEach((subscription) => {
        subscription.unsubscribe();
      });
    }

    supabaseClient
      .channel("Elections")
      .on(
        "postgres_changes",
        { event: "DELETE", schema: "public", table: "elections" },
        this.handleElectionsTableChanges
      )
      .subscribe();

    const { data, error } = await supabaseClient.from("elections").select(`
      election_title,
      election_start_date,
      election_end_date,
      election_id
    `);

    const currentDate = new Date().toISOString();
    const { data: onGoingElections } = await supabaseClient
      .from("elections")
      .select(
        `
        election_title,
        election_start_date,
        election_end_date,
        election_id
      `
      )
      .lte("election_start_date", currentDate)
      .gte("election_end_date", currentDate);

    const { data: upcomingElections } = await supabaseClient
      .from("elections")
      .select(
        `
      election_title,
      election_start_date,
      election_end_date,
      election_id
      `
      )
      .gt("election_start_date", currentDate);

    console.log("On going elections: ", onGoingElections);
    console.log("Upcoming Elections: ", upcomingElections);

    if (data && data?.length === 0) {
      const emptyElections = this.createEmptyElectionsElement();
      removeAllChildren(dataContainer);
      dataContainer.appendChild(emptyElections);
    }

    if (data && data?.length > 0) {
      removeAllChildren(dataContainer);
      if (this.role === "admin") {
        const electionsTable = this.createElectionsTable(
          ["name", "start date", "end date", "actions"],
          data
        );
        dataContainer.appendChild(electionsTable);
        return;
      }

      if (this.role === "student" || this.role === "candidate") {
        const container = document.createElement("div");
        container.className =
          "w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 justify-center md:justify-start gap-5 h-fit overflow-y-auto";

        const filters = document.createElement("header");
        filters.className = "flex ";

        const onGoingElectionCards = onGoingElections.map((election) => {
          return this.createElectionCard(election, "ongoing");
        });

        const upcomingElectionCards = upcomingElections.map((election) => {
          return this.createElectionCard(election, "upcoming");
        });

        // const elections = data.map((election) => {
        //   return this.createElectionCard(election);
        // });

        container.append(...onGoingElectionCards, ...upcomingElectionCards);
        dataContainer.appendChild(container);
        return;
      }
    }

    if (error) {
      this.showToast(error.message, "error");
    }

    // removeAllChildren(dataContainer);
  }

  createEmptyElectionsElement() {
    const emptyElections = document.createElement("div");
    const emptyElectionsContainer = document.createElement("div");
    emptyElectionsContainer.className =
      "flex flex-col items-center h-fit w-fit";

    emptyElections.className = "w-full h-full flex justify-center items-center";
    const mainSvg = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "svg"
    );
    mainSvg.setAttribute("id", "SvgjsSvg1158");
    mainSvg.classList.add("w-12", "h-12");
    mainSvg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    mainSvg.setAttribute("version", "1.1");
    mainSvg.setAttribute("xmlns:xlink", "http://www.w3.org/1999/xlink");
    mainSvg.setAttribute("xmlns:svgjs", "http://svgjs.com/svgjs");

    const defsElement = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "defs"
    );
    defsElement.setAttribute("id", "SvgjsDefs1159");
    mainSvg.appendChild(defsElement);

    const gElement = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "g"
    );
    gElement.setAttribute("id", "SvgjsG1160");
    mainSvg.appendChild(gElement);

    const nestedSvg = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "svg"
    );
    nestedSvg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    nestedSvg.setAttribute("viewBox", "0 0 66 66");
    nestedSvg.classList.add("w-12", "h-12");

    const path1 = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "path"
    );
    path1.setAttribute(
      "d",
      "M50.02 9.36H22.93c-.41 0-.75.34-.75.75s.34.75.75.75h27.09c.41 0 .75-.34.75-.75s-.34-.75-.75-.75zm0 4.13H22.93c-.41 0-.75.34-.75.75s.34.75.75.75h27.09c.41 0 .75-.34.75-.75s-.34-.75-.75-.75zm.75 4.89c0-.41-.34-.75-.75-.75H22.93c-.41 0-.75.34-.75.75s.34.75.75.75h27.09c.41 0 .75-.33.75-.75zm-27.84 3.39c-.41 0-.75.34-.75.75s.34.75.75.75h17.09c.41 0 .75-.34.75-.75s-.34-.75-.75-.75H22.93z"
    );
    path1.setAttribute("fill", "#000000");
    path1.setAttribute("class", "color000 svgShape");

    const path2 = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "path"
    );
    path2.setAttribute(
      "d",
      "M61.39 20.4h-9.27c-.82 0-1.6.35-2.15.95l-4.14 4.52c-.27.29-.65.46-1.05.46H14.82c-.52 0-1 .15-1.42.38v-3.39c0-.78.64-1.42 1.42-1.42h1.59v2.18c0 .41.34.75.75.75s.75-.34.75-.75V6.01h37.13v12.15c0 .41.34.75.75.75s.75-.34.75-.75V5.26c0-.41-.34-.75-.75-.75H17.16c-.41 0-.75.34-.75.75V20.4h-1.59c-1.61 0-2.92 1.31-2.92 2.92v16.73c0 .41.34.75.75.75s.75-.34.75-.75v-5.01h49.4v26.78c0 .78-.64 1.42-1.42 1.42h-40c-.41 0-.75.34-.75.75s.34.75.75.75h40c1.61 0 2.92-1.31 2.92-2.92v-38.5c.01-1.61-1.3-2.92-2.91-2.92zM13.4 33.55v-4.3c0-.78.64-1.42 1.42-1.42h29.95c.82 0 1.6-.35 2.15-.95l4.14-4.52c.27-.29.65-.46 1.05-.46h9.27c.78 0 1.42.64 1.42 1.42v10.22H13.4z"
    );
    path2.setAttribute("fill", "#000000");
    path2.setAttribute("class", "color000 svgShape");

    const path3 = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "path"
    );
    path3.setAttribute(
      "d",
      "M24.15 53.52c0-6.19-5.04-11.23-11.23-11.23S1.69 47.33 1.69 53.52s5.04 11.23 11.23 11.23 11.23-5.04 11.23-11.23zm-11.23 9.73c-5.36 0-9.73-4.36-9.73-9.73s4.36-9.73 9.73-9.73 9.73 4.36 9.73 9.73-4.36 9.73-9.73 9.73z"
    );
    path3.setAttribute("fill", "#000000");
    path3.setAttribute("class", "color000 svgShape");

    const path4 = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "path"
    );
    path4.setAttribute(
      "d",
      "M12.92 45.29c-4.54 0-8.23 3.69-8.23 8.23s3.69 8.23 8.23 8.23 8.23-3.69 8.23-8.23-3.69-8.23-8.23-8.23zm0 14.96c-3.71 0-6.73-3.02-6.73-6.73s3.02-6.73 6.73-6.73 6.73 3.02 6.73 6.73-3.02 6.73-6.73 6.73z"
    );
    path4.setAttribute("fill", "#000000");
    path4.setAttribute("class", "color000 svgShape");

    const path5 = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "path"
    );
    path5.setAttribute(
      "d",
      "m15.65 50.53-4.4 4.4-1.05-1.05c-.29-.29-.77-.29-1.06 0s-.29.77 0 1.06l1.58 1.58c.15.15.34.22.53.22s.38-.07.53-.22l4.93-4.93c.29-.29.29-.77 0-1.06s-.77-.3-1.06 0zm4.77-47.78H58.3v15.4c0 .41.34.75.75.75s.75-.34.75-.75V2c0-.41-.34-.75-.75-.75H20.42c-.41 0-.75.34-.75.75s.34.75.75.75z"
    );
    path5.setAttribute("fill", "#000000");
    path5.setAttribute("class", "color000 svgShape");

    nestedSvg.appendChild(path1);
    nestedSvg.appendChild(path2);
    nestedSvg.appendChild(path3);
    nestedSvg.appendChild(path4);
    nestedSvg.appendChild(path5);

    mainSvg.appendChild(nestedSvg);

    const emptyElectionsText = document.createElement("span");
    emptyElectionsText.className = "text-sm font-light py-2";
    emptyElectionsText.textContent = "No Elections";
    emptyElectionsContainer.append(mainSvg, emptyElectionsText);

    emptyElections.append(emptyElectionsContainer);
    return emptyElections;
  }

  createElectionCard(election, type = undefined) {
    const {
      election_title,
      election_start_date,
      election_end_date,
      election_id,
    } = election;

    const electionCard = document.createElement("div");
    electionCard.className =
      "flex flex-col items-center gap-y-4 p-5 w-full h-full bg-white shadow-lg rounded";

    // create the election icon
    const electionIcon = this.createElectionIcon();

    // Election title
    const electionTitle = document.createElement("h3");
    electionTitle.className = "text-gray-800 font-semibold text-lg";
    electionTitle.textContent = election_title;

    // Election start date
    const electionStartDate = document.createElement("p");
    electionStartDate.className = "text-gray-500 font-semibold text-md";
    electionStartDate.textContent = `From: ${formatDateAndTime(
      election_start_date
    )}`;

    // Election end date
    const electionEndDate = document.createElement("p");
    electionEndDate.className = "text-gray-500 font-semibold text-md";
    electionEndDate.textContent = `To: ${formatDateAndTime(election_end_date)}`;

    electionCard.append(
      electionIcon,
      electionTitle,
      electionStartDate,
      electionEndDate
    );

    if (type === "ongoing") {
      // Vote CTA
      const voteCTA = document.createElement("a");
      voteCTA.className =
        "text-sm rounded-md p-2 font-semibold capitalize text-gray-50 hover:text-popup-600 bg-success-500 hover:bg-popup-100 cursor-pointer";
      voteCTA.textContent = "Let's vote";
      voteCTA.addEventListener("click", (event) => {
        event.preventDefault();
        navigateTo(`/elections/${election_id}/vote`);
      });
      electionCard.appendChild(voteCTA);
    }

    if (type === "upcoming") {
      const remainingTimeSection = document.createElement("section");
      remainingTimeSection.className = "flex flex-col gap-y-0.5";

      // Count down
      const countDown = document.createElement("div");
      countDown.className = "flex gap-x-2 w-fit";

      // Days
      const daysContainer = document.createElement("div");
      daysContainer.className = "flex flex-col gap-y-1 w-fit";

      const countDownDays = document.createElement("span");
      countDownDays.className = "p-2 bg-grey-100 w-8 rounded";

      const countDownDaysLabel = document.createElement("p");
      countDownDaysLabel.className = "text-xs uppercase font-light";
      countDownDaysLabel.textContent = "days";

      daysContainer.append(countDownDays, countDownDaysLabel);

      // Hours
      const hoursContainer = document.createElement("div");
      hoursContainer.className = "flex flex-col gap-y-1 w-fit";

      const countDownHours = document.createElement("span");
      countDownHours.className = "p-2 bg-grey-100 w-8 rounded";

      const countDownHoursLabel = document.createElement("p");
      countDownHoursLabel.className = "text-xs uppercase font-light";
      countDownHoursLabel.textContent = "hrs";

      hoursContainer.append(countDownHours, countDownHoursLabel);

      // Minutes
      const minutesContainer = document.createElement("div");
      minutesContainer.className = "flex flex-col gap-y-1 w-fit";

      const countDownMinutes = document.createElement("span");
      countDownMinutes.className = "p-2 bg-grey-100 w-8 rounded";

      const countDownMinutesLabel = document.createElement("p");
      countDownMinutesLabel.className = "text-xs uppercase font-light";
      countDownMinutesLabel.textContent = "mins";

      minutesContainer.append(countDownMinutes, countDownMinutesLabel);

      // Seconds
      const secondsContainer = document.createElement("div");
      secondsContainer.className = "flex flex-col gap-y-1 w-fit";

      const countDownSeconds = document.createElement("span");
      countDownSeconds.className = "p-2 bg-grey-100 w-8 rounded";

      const countDownSecondsLabel = document.createElement("p");
      countDownSecondsLabel.className = "text-xs uppercase font-light";
      countDownSecondsLabel.textContent = "secs";

      secondsContainer.append(countDownSeconds, countDownSecondsLabel);

      const { days, hours, minutes, seconds } =
        getRemainingTime(election_start_date);
      countDownDays.textContent = days;
      countDownHours.textContent = hours;
      countDownMinutes.textContent = minutes;
      countDownSeconds.textContent = seconds;

      // countDownText.className = "text-gray-500 font-semibold text-md";
      setInterval(() => {
        const { days, hours, minutes, seconds } =
          getRemainingTime(election_start_date);
        countDownDays.textContent = days;
        countDownHours.textContent = hours;
        countDownMinutes.textContent = minutes;
        countDownSeconds.textContent = seconds;
      }, 1000);

      countDown.append(
        daysContainer,
        hoursContainer,
        minutesContainer,
        secondsContainer
      );

      const remainingTimeSectionText = document.createElement("span");
      remainingTimeSectionText.className =
        "text-sm font-light text-center w-full";
      remainingTimeSectionText.textContent = "TO VOTE";

      remainingTimeSection.append(countDown, remainingTimeSectionText);

      electionCard.appendChild(remainingTimeSection);
    }

    return electionCard;
  }

  createClockIcon() {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.classList.add("w-7", "h-7");
    svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    svg.setAttribute("viewBox", "0 0 36 36");

    const path1 = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "path"
    );
    path1.setAttribute("fill", "currentColor");
    path1.setAttribute(
      "d",
      "M18 2a16 16 0 1 0 16 16A16 16 0 0 0 18 2Zm6.2 21.18a1 1 0 0 1-1.39.28l-5.9-4v-8.71a1 1 0 0 1 2 0v7.65l5 3.39a1 1 0 0 1 .29 1.39Z"
    );

    const path2 = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "path"
    );
    path2.setAttribute("fill", "none");
    path2.setAttribute("d", "M0 0h36v36H0z");

    svg.appendChild(path1);
    svg.appendChild(path2);

    return svg;
  }

  createElectionIcon() {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.classList.add("w-20", "h-20", "text-gray-500");
    svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    svg.setAttribute("viewBox", "0 0 512 512");

    const pathData =
      "M494 21.621c-14.947 8.43-29.566 17.581-43.67 29.227l7.318 38.547C471.923 93.66 483.583 95.26 494 95.36V21.62zm-98.982 24.512c-15.283-.085-32.48 2.596-53.832 6.834l-.22.043l-.22.033c-14.77 2.177-40.794 12.065-66.465 38.867l44.27 11.766c.972-1.493 5.936-9.004 6.88-10.555c5.124 3.123 10.248 6.244 15.372 9.365c-12.475 20.475-26.742 35.556-43.934 54.522c-2.123 4.718.977 8.199 4.36 10.14c5.22 2.931 14.1 3.09 16.437 2.102c23.932-15.768 40.819-35.928 55.963-56.271l5.469.964c11.501 2.031 26.47 1.058 38.707-2.853c11.098-3.548 19.272-9.357 22.662-15.688L432.54 53.65c-12.044-5.214-24.039-7.442-37.523-7.517zM227.932 98.717l-29.436 115.986l9.643.297H311.27l.9-.209l6.804-27.092c-8.86 1.9-18.296-.217-26.557-4.855c-5.188-2.913-10.024-7.24-12.621-13.434c-7.797-19.938 15.857-37.297 28.724-52.75l-80.59-17.943zM69.562 201l-23 46h418.875l-23-46H334.195l-3.517 14H352v18H160v-18h19.852l3.552-14H69.563zM41 265v222h430V265H41zm14 14h402v194H55V279zm18 18v118.238l34.502-74.994l73.36 31.762l66.652-45.84l37.513 57.273l50.11-4.595l31.3-39.332L439 394.627V297H73zm169.543 54.43l-90.63 62.33l27.01 41.24h95.606l19.666-24.71l-51.652-78.86zm-126.045 12.326L74.521 455h82.885l-30.193-46.098l36.144-24.857l-46.859-20.29zm253.065.732L297.533 455h140.54l.927-1.166v-36.602l-69.438-52.744zm-49.944 33.854l-23.426 2.148l9.805 14.969l13.621-17.117z";

    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("fill", "currentColor");
    path.setAttribute("d", pathData);

    svg.appendChild(path);

    return svg;
  }

  async renderContent() {
    const pageLoader = this.renderPageLoader();
    if (!this.role) return pageLoader;

    const layout = await this.renderProtectedLayout();
    const loader = this.renderLoader();
    const contentArea = layout.querySelector("#content-area");
    const contentHeader = document.createElement("header");
    contentHeader.className = "flex justify-between h-fit";

    const dataContainer = document.createElement("div");
    dataContainer.id = "data-container";
    dataContainer.className =
      "w-full h-full mt-2 overflow-y-auto flex flex-wrap";

    const viewHeading = document.createElement("h2");
    viewHeading.className = "text-lg font-semibold capitalize";
    viewHeading.textContent = "elections";

    const createElectionCTA = document.createElement("a");
    createElectionCTA.className =
      "text-sm rounded-md p-2 font-semibold capitalize text-gray-50 hover:text-popup-600 bg-success-500 hover:bg-popup-100 cursor-pointer";
    createElectionCTA.textContent = "set election";
    createElectionCTA.addEventListener("click", (event) => {
      event.preventDefault();
      navigateTo("/elections/set-election");
    });

    this.role === "admin"
      ? contentHeader.append(viewHeading, createElectionCTA)
      : contentHeader.append(viewHeading);

    this.isFetching = true;
    if (this.isFetching) {
      const dataContainerLoader = document.createElement("div");
      dataContainerLoader.id = "data-container-loader";
      dataContainerLoader.className =
        "flex w-full h-full justify-center items-center";
      dataContainerLoader.appendChild(loader);
      dataContainer.append(dataContainerLoader);
      this.renderElections(dataContainer);
    }
    contentArea.appendChild(contentHeader);
    contentArea.appendChild(dataContainer);

    return layout;
  }
}
