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
        if(t?.tests){
          let testLabel = ""
          t.tests.forEach((testName,i)=>{
             testLabel = testLabel + (i < t.tests.length-1 ? testName.label+", " : testName.label)
          })
          const packageElement = `
             <li class="list-group-item border m-1 p-0 rounded-3">
                 <div class="list-group-item-action p-2 cursor-pointer">
                        <div class="d-flex justify-content-between align-items-start mb-1">
                          <span
                            class="mb-0 text-dark text-sm"
                            style="word-break: break-word"
                          >
                            ${t.label}
                          </span>
                          <button
                            data-id="${t.id}"
                            class="btn btn-link text-danger p-0 border-0 test-cancel ms-2"
                            title="Remove Package"
                          >
                            <i class="fas fa-times-circle"></i>
                          </button>
                        </div>

                        <div class="d-flex flex-column gap-2">
                          <small
                            class="text-muted"
                            style="
                              word-break: break-word;
                              overflow-wrap: break-word;
                              line-height: 1.4;
                            "
                          >
                            ${testLabel}
                          </small>
                          <div
                            class="d-flex justify-content-end align-items-center"
                          >
                            <span
                              class="badge text-primary fw-bold"
                            >
                              ₹${t.price}
                            </span>
                        </div>
                     </div>
                 </div>
              </li>
          `
          $selectedTestArea.append(packageElement)
        }else{
          $selectedTestArea.append(`
                              <li class="list-group-item d-flex justify-content-between align-items-center border-0 py-2 px-2">
                                 <small>${t.label}</small>
                                 <div class="d-flex justify-content-end align-items-center gap-2">
                                    <small class="fw-bold text-primary"><b>₹${t.price}</b></small>
                                   <button data-id="${t.id}" class="btn text-danger text-md test-cancel p-0 m-0" style="font-size: 0.6rem"><i class="fas fa-times-circle"></i></button>
                                 </div>
                              </li>
                            `);
        }

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
                                <input type="checkbox" class="selectCheckbox" data-id="${
                                  i.id
                                }" />
                                <span style="font-weight:normal;" class="d-block d-md-inline">${
                                  i.label
                                }</span>
                              </div>
                             <small class="${
                               i.testCount
                                 ? "text-muted d-block ms-4"
                                 : "d-none"
                             }">${i.testCount || ""} tests</small>
                          </div>
                         <span class="fw-bold text-primary">₹${i.price}</span>
                        </div>
                     </label>
                    `);
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
        allTest = [...allTest, packageTestsMap[parseInt(id)]];
        renderSelectedTest(allTest);
      }
    } else {
      if (selected == "test") {
        allTest = allTest.filter((i) => i.id != id);
        renderSelectedTest(allTest);
      } else {
        allTest = allTest.filter((test) => test.id != id);
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
          `<div data-category="${i.id}" role="button" style="width: fit-content; display: inline-block;" class="bg-light px-2 rounded-4 text-sm text-center category-chips">${i.label}</div>`
        );
      });
    }
  }

  $selectedTestArea.on("click", ".test-cancel", function () {
    const testId = $(this).data("id");
    allTest = allTest.filter((i) => i.id != testId);
    renderSelectedTest(allTest);
  });

  $categoryArea.on("click",".category-chips",function(){
     const selectedCategory = categoryTestsMap[$(this).data("category")]
      renderTest(selectedCategory.tests);
  })

  $(document).ready(function () {
    renderSelectedTest(allTest);
    renderTopChips();
    renderTest(labTests);
  });
});
