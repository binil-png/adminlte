$(function () {
  let allTest = [];
  let selected = "test";
  const $categoryArea = $("#categoryArea");
  const $selectedTestArea = $("#selectedTestArea");
  const $allTestArea = $("#allTestArea");
  const $labpricearea = $("#labpricearea");
  const $selectedCount = $("#selectedCount");
  function renderSelectedTest(list) {
    $selectedTestArea.empty();
    let price = 0;
    if (list.length) {
      list.forEach((t) => {
        $selectedTestArea.append(`
                            <li class="list-group-item d-flex justify-content-between align-items-center border-0 py-2">
                               <small>${t.label}</small>
                               <div class="d-flex justify-content-end align-items-center gap-2">
                                  <small><b>₹${t.price}</b></small>
                                 <button data-id="${t.id}" class="btn text-danger text-md test-cancel p-0 m-0" style="font-size: 0.6rem"><i class="fas fa-times"></i></button>
                               </div>
                            </li>
                          `);

        price += t.price;
      });
      $labpricearea.text(price);
      $selectedCount.text(list.length);
    } else {
      $selectedTestArea.append(`
        <li class="list-group-item d-flex justify-content-between align-items-center border-0 py-2">
          <small>No test selected</small>
        </li>
        `);
      $selectedCount.text(0);
      $labpricearea.text(0);
    }
  }

  function renderTest(list) {
    $allTestArea.empty();
    if (list) {
      list.forEach((i) => {
        $allTestArea.append(`
   <label class="list-group-item list-group-item-action p-1 m-0 cursor-pointer">
      <div class="d-flex w-100 justify-content-between align-items-center">
         <div class="px-1">
            <div class="d-flex justify-content-start align-items-center gap-2">
              <input type="checkbox" class="selectCheckbox" data-id="${i.id}" />
              <span class="fw-bold d-block d-md-inline">${i.label}</span>
            </div>
           <small class="${
             i.testCount ? "text-muted d-block ms-4" : "d-none"
           }">${i.testCount || ""} tests</small>
        </div>
       <span class="fw-bold">₹1800</span>
      </div>
   </label>`);
      });
    }
  }

  $allTestArea.on("change", ".selectCheckbox", function () {
    const id = $(this).data("id");
    const isChecked = $(this).is(":checked");
    if (isChecked) {
      if (selected == "test") {
        const item = labTests.find((i) => i.id == id);
        allTest.push(item);
        renderSelectedTest(allTest);
      } else {
        allTest = [...allTest, ...packageTestsMap[parseInt(id)]];
        renderSelectedTest(allTest);
      }
    } else {
      if (selected == "test") {
        allTest = allTest.filter((i) => i.id != id);
        renderSelectedTest(allTest);
      } else {
        const idsToRemove = packageTestsMap[id].map((t) => t.id);
        allTest = allTest.filter((test) => !idsToRemove.includes(test.id));
        renderSelectedTest(allTest);
      }
    }
  });

  const $changetotest = $("#changetotest");
  const $changetopackage = $("#changetopackage");

  $changetotest.on("click", function () {
    $changetotest.addClass("active");
    $changetopackage.removeClass("active");
    renderTest(labTests);
    selected = "test";
  });
  $changetopackage.on("click", function () {
    $changetotest.removeClass("active");
    $changetopackage.addClass("active");
    renderTest(labPackages);
    selected = "package";
  });

  function renderTopChips() {
    $categoryArea.empty();
    if (testCategories.length) {
      testCategories.forEach((i) => {
        $categoryArea.append(
          `<div role="button" style="width: fit-content; display: inline-block;" class="bg-light px-2 rounded-4 text-sm text-center">${i.label} tests</div>`
        );
      });
    }
  }

  $selectedTestArea.on("click", ".test-cancel", function () {
    const testId = $(this).data("id");
    allTest = allTest.filter((i) => i.id != testId);
    renderSelectedTest(allTest);
  });

  $(document).ready(function () {
    renderSelectedTest(allTest);
    renderTopChips();
    renderTest(labTests);
  });
});
