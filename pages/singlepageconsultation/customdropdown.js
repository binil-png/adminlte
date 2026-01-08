class CustomDropdown {
  conntainer = null;
  renderList = [];
  selectedContainer = null
  showEmpty = null
  constructor(con, list, selected,empty) {
    this.conntainer = con;
    this.renderList = list;
    this.selectedContainer = selected
    this.showEmpty = empty
  }
  renderList(filter = "") {
    $container.empty();
    const query = filter.toLowerCase();
    const filteredPatients = this.renderList.filter((p) =>
      p.label.toLowerCase().includes(query)
    );

    if (filteredPatients.length > 0) {
      this.showEmpty.addClass("d-none");
      filteredPatients.forEach((p) => {
        const itemHtml = `
          <button class="dropdown-item py-2 border-bottom ignore-edit" type="button">
            <div class="d-flex align-items-center">
              <div class="text-muted small">${p.label}</div>
            </div>
          </button>`;

        const $item = $(itemHtml);
        $item.on("click", function () {
          this.selectedContainer.text(p.label);
        });
        this.conntainer.append($item);
      });
    } else {
      this.showEmpty.removeClass("d-none");
    }
  }
}
