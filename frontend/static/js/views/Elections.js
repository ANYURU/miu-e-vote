import AbstractView from "./AbstractView.js";
import { supabaseClient, navigateTo, removeAllChildren } from "../index.js";
import { formatDate } from "../helpers/formatDate.js";

export default class extends AbstractView {
  constructor(params) {
    super(params);
    this.setTitle("Elections");
    this.openNav = false;
    this.supabaseClient = supabaseClient;
    this.loading = false;
    this.isFetching = false;
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

      const deleteButton = document.createElement("button");
      deleteButton.className =
        "p-1 group border-[0.5px] border-black-300 hover:border-danger-600 hover:bg-danger-100 rounded-lg";
      const deleteIcon = this.createDeleteIcon();
      deleteButton.appendChild(deleteIcon);

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

  async renderElections(dataContainer) {
    const { data } = await supabaseClient.from("elections").select();
    if (data && data?.length === 0) {
      const emptyElections = document.createElement("div");
      const emptyElectionsContainer = document.createElement("div");
      emptyElectionsContainer.className =
        "flex flex-col items-center h-fit w-fit";

      emptyElections.className =
        "w-full h-full flex justify-center items-center";
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

      removeAllChildren(dataContainer);
      emptyElections.append(emptyElectionsContainer);
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
          "w-full flex flex-wrap h-full overflow-y-auto border border-red-500";
        return container;
      }
    }

    // removeAllChildren(dataContainer);
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
