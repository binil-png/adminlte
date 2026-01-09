$(function () {
  const $customDrawer = $("#customDrawer");
  const $drawerContent = $("#drawerContent");
  const $drawerHeader = $("#drawerHeader");

  $(".openDrawer").on("click", function () {
    const drawerType = $(this).data("drawertype");
    $drawerContent.empty();
    if (drawerType == "ip") {
      $drawerHeader.text("IP Actions");
      $drawerContent.append(`
             <div>
      <div class="px-4 py-3 text-center border-bottom mb-2">
        <h6 class="font-weight-bold mb-1">
          CHECK IN ON: 01-01-2026 (04:50 pm)
        </h6>
        <div class="d-flex justify-content-between small px-3">
          <span>FLOOR: 1st</span>
          <span>BED: 1001</span>
          <span>IP: 93</span>
        </div>
      </div>

      <div class="container-fluid">
        <div class="row g-2">
          <div class="col-4">
            <a
              class="btn btn-sm btn-outline-dark rounded-3 w-100 d-flex flex-column align-items-center justify-content-center py-3"
            >
              <i class="far fa-hospital mb-1"></i>
              <span style="font-size: 14px">Convert to IP</span>
            </a>
          </div>
          <div class="col-4">
            <a
              class="btn btn-sm btn-outline-dark rounded-3 w-100 d-flex flex-column align-items-center justify-content-center py-3"
            >
              <i class="fas fa-bed mb-1"></i>
              <span style="font-size: 14px">Edit Bed</span>
            </a>
          </div>
          <div class="col-4">
            <a
              class="btn btn-sm btn-outline-dark rounded-3 w-100 d-flex flex-column align-items-center justify-content-center py-3"
            >
              <i class="fas fa-file-invoice mb-1"></i>
              <span style="font-size: 14px">IP Billing</span>
            </a>
          </div>
          <div class="col-4">
            <a
              class="btn btn-sm btn-outline-dark rounded-3 w-100 d-flex flex-column align-items-center justify-content-center py-3"
            >
              <i class="fas fa-user-md mb-1"></i>
              <span style="font-size: 14px">Consultation</span>
            </a>
          </div>

          <div class="col-8">
            <a
              class="btn btn-sm btn-outline-dark rounded-3 w-100 d-flex flex-column align-items-center justify-content-center py-3"
            >
              <i class="far fa-file-alt"></i>
              <span style="font-size: 14px"
                >Discharge summary / Case sheet</span
              >
            </a>
          </div>

          <div class="col-4">
            <a
              class="btn btn-sm btn-outline-dark rounded-3 w-100 d-flex flex-column align-items-center justify-content-center py-3"
            >
              <i class="fas fa-user-nurse mb-1"></i>
              <span style="font-size: 14px">Nursing</span>
            </a>
          </div>

          <div class="col-4">
            <a
              class="btn btn-sm btn-outline-danger rounded-3 w-100 d-flex flex-column align-items-center justify-content-center py-3"
            >
              <i class="fas fa-sign-out-alt mb-1"></i>
              <span style="font-size: 14px">Discharge</span>
            </a>
          </div>
        </div>
      </div>
    </div>`);
    } else {
      $drawerHeader.text("OP Actions");
      $drawerContent.append(`
                                  <div class="container-fluid pt-3">
      <div class="row g-2">
        <div style="height: 60px" class="col-4 d-flex">
          <a
            class="btn btn-sm btn-outline-dark rounded-3 w-100 d-flex flex-column align-items-center justify-content-center py-3"
          >
            <i class="fas fa-print"></i>
            <span style="font-size: 14px">Print id</span>
          </a>
        </div>
        <div style="height: 60px" class="col-4 d-flex">
          <a
            class="btn btn-sm btn-outline-dark rounded-3 w-100 d-flex flex-column align-items-center justify-content-center py-3"
          >
            <i class="fab fa-google"></i>
            <span style="font-size: 14px">Google meeting</span>
          </a>
        </div>
        <div style="height: 60px" class="col-4 d-flex">
          <a
            class="btn btn-sm btn-outline-dark rounded-3 w-100 d-flex flex-column align-items-center justify-content-center py-3"
          >
            <i class="fas fa-video"></i>
            <span style="font-size: 14px">Zoom meeting</span>
          </a>
        </div>
        <div style="height: 60px" class="col-4 d-flex">
          <a
            class="btn btn-sm btn-outline-dark rounded-3 w-100 d-flex flex-column align-items-center justify-content-center py-3"
          >
            <i class="fab fa-wpforms"></i>
            <span style="font-size: 14px">Consent form</span>
          </a>
        </div>
        <div style="height: 60px" class="col-4 d-flex">
          <a
            class="btn btn-sm btn-outline-dark rounded-3 w-100 d-flex flex-column align-items-center justify-content-center py-3"
          >
            <i class="fab fa-wpforms"></i>
            <span style="font-size: 14px">Medical certificate</span>
          </a>
        </div>
        <div style="height: 60px" class="col-4 d-flex">
          <a
            class="btn btn-sm btn-outline-dark rounded-3 w-100 d-flex flex-column align-items-center justify-content-center py-3"
          >
            <i class="fab fa-google"></i>
            <span style="font-size: 14px">Request google review</span>
          </a>
        </div>
      </div>
      <div>
        <div class="p-2 mt-3">
          <h6 class="font-weight-bold p-0 m-0">Blank prescription</h6>
        </div>
        <div class="row g-2 py-3">
          <div style="height: 60px" class="col-4 d-flex">
            <a
              class="btn btn-sm btn-outline-dark rounded-3 w-100 d-flex flex-column align-items-center justify-content-center py-3"
            >
              <i class="fas fa-print"></i>
              <span style="font-size: 14px">With Header</span>
            </a>
          </div>
          <div style="height: 60px" class="col-4 d-flex">
            <a
              class="btn btn-sm btn-outline-dark rounded-3 w-100 d-flex flex-column align-items-center justify-content-center py-3"
            >
              <i class="fas fa-print"></i>
              <span style="font-size: 14px">Without Header</span>
            </a>
          </div>
        </div>
      </div>
      <div>
        <div class="p-2 mt-3">
          <h6 class="font-weight-bold p-0 m-0">Charts</h6>
        </div>
        <div class="row g-2 py-3">
          <div style="height: 60px" class="col-4 d-flex">
            <a
              class="btn btn-sm btn-outline-dark rounded-3 w-100 d-flex flex-column align-items-center justify-content-center py-3"
            >
              <i class="far fa-list-alt"></i>
              <span style="font-size: 14px">Health assessment </span>
            </a>
          </div>
          <div style="height: 60px" class="col-4 d-flex">
            <a
              class="btn btn-sm btn-outline-dark rounded-3 w-100 d-flex flex-column align-items-center justify-content-center py-3"
            >
              <i class="far fa-list-alt"></i>
              <span style="font-size: 14px">Immunisation chart</span>
            </a>
          </div>
          <div style="height: 60px" class="col-4 d-flex">
            <a
              class="btn btn-sm btn-outline-dark rounded-3 w-100 d-flex flex-column align-items-center justify-content-center py-3"
            >
              <i class="far fa-list-alt"></i>
              <span style="font-size: 14px">Chart x</span>
            </a>
          </div>
          <div style="height: 60px" class="col-4 d-flex">
            <a
              class="btn btn-sm btn-outline-dark rounded-3 w-100 d-flex flex-column align-items-center justify-content-center py-3"
            >
              <i class="far fa-list-alt"></i>
              <span style="font-size: 14px">Chart y</span>
            </a>
          </div>
          <div style="height: 60px" class="col-4 d-flex">
            <a
              class="btn btn-sm btn-outline-dark rounded-3 w-100 d-flex flex-column align-items-center justify-content-center py-3"
            >
              <i class="far fa-list-alt"></i>
              <span style="font-size: 14px">Chart z</span>
            </a>
          </div>
        </div>
      </div>
    </div>`);
    }

    $customDrawer.addClass("open");
    $("#drawerOverlay").fadeIn();
  });

  $("#closeDrawer, #drawerOverlay").on("click", function () {
    $customDrawer.removeClass("open");
    $("#drawerOverlay").fadeOut();
    // Use a delay to empty content after animation finishes
    setTimeout(() => {
      $drawerContent.empty();
    }, 300);
  });
});
