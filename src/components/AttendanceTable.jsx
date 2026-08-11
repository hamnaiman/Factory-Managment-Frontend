function AttendanceTable({
  workers = [],
  attendance = [],
  search = "",
  onStatusChange,
  onAddPayment,
}) {
  const safeWorkers = Array.isArray(workers)
    ? workers
    : [];

  const safeAttendance = Array.isArray(attendance)
    ? attendance
    : [];

  const searchValue = String(search || "").toLowerCase();

  const filteredWorkers = safeWorkers.filter((worker) =>
    String(worker?.name || "")
      .toLowerCase()
      .includes(searchValue)
  );

  // =====================================================
  // GET CURRENT STATUS
  // =====================================================

  const getStatus = (workerId) => {
    const record = safeAttendance.find((item) => {
      const attendanceWorker =
        typeof item?.worker === "object"
          ? item?.worker?._id
          : item?.worker;

      return String(attendanceWorker) === String(workerId);
    });

    return record?.status || "";
  };

  // =====================================================
  // STATUS CHANGE
  // =====================================================

  const handleStatusChange = (workerId, status) => {
    if (!workerId || !status) return;

    /*
      IMPORTANT:

      Existing attendance can ALWAYS be changed.

      Present → Absent
      Present → Leave
      Absent → Present
      Leave → Present

      No button is disabled.
    */

    onStatusChange(workerId, status);
  };

  if (filteredWorkers.length === 0) {
    return (
      <div className="flex min-h-[180px] items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-500">
        No workers found.
      </div>
    );
  }

  return (
    <>
      {/* =====================================================
          DESKTOP
      ===================================================== */}

      <div className="hidden lg:block">
        <div className="w-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

          {/* Header */}

          <div className="grid grid-cols-12 items-center border-b border-slate-200 bg-slate-50 px-5 py-4 font-semibold text-slate-700">

            <div className="col-span-3">
              Worker
            </div>

            <div className="col-span-2">
              Department
            </div>

            <div className="col-span-4 text-center">
              Attendance
            </div>

            <div className="col-span-3 text-center">
              Payment
            </div>

          </div>

          {/* Rows */}

          {filteredWorkers.map((worker) => {
            const status = getStatus(worker._id);

            return (
              <div
                key={worker._id}
                className="grid grid-cols-12 items-center border-b border-slate-100 px-5 py-5 transition hover:bg-slate-50"
              >

                {/* Worker */}

                <div className="col-span-3 min-w-0">
                  <h3 className="truncate font-semibold text-slate-800">
                    {worker.name}
                  </h3>
                </div>

                {/* Department */}

                <div className="col-span-2 min-w-0 text-slate-500">
                  <span className="block truncate">
                    {worker.department || "-"}
                  </span>
                </div>

                {/* Attendance */}

                <div className="col-span-4">
                  <div className="flex items-center justify-center gap-5">

                    {/* PRESENT */}

                    <label className="flex cursor-pointer items-center gap-2 whitespace-nowrap">
                      <input
                        type="radio"
                        name={`attendance-${worker._id}`}
                        checked={status === "present"}
                        onChange={() =>
                          handleStatusChange(
                            worker._id,
                            "present"
                          )
                        }
                        className="h-4 w-4"
                      />

                      <span className="text-sm font-medium text-green-600">
                        Present
                      </span>
                    </label>

                    {/* ABSENT */}

                    <label className="flex cursor-pointer items-center gap-2 whitespace-nowrap">
                      <input
                        type="radio"
                        name={`attendance-${worker._id}`}
                        checked={status === "absent"}
                        onChange={() =>
                          handleStatusChange(
                            worker._id,
                            "absent"
                          )
                        }
                        className="h-4 w-4"
                      />

                      <span className="text-sm font-medium text-red-600">
                        Absent
                      </span>
                    </label>

                    {/* LEAVE */}

                    <label className="flex cursor-pointer items-center gap-2 whitespace-nowrap">
                      <input
                        type="radio"
                        name={`attendance-${worker._id}`}
                        checked={status === "leave"}
                        onChange={() =>
                          handleStatusChange(
                            worker._id,
                            "leave"
                          )
                        }
                        className="h-4 w-4"
                      />

                      <span className="text-sm font-medium text-orange-500">
                        Leave
                      </span>
                    </label>

                  </div>
                </div>

                {/* Payment */}

                <div className="col-span-3 flex justify-center">
                  <button
                    type="button"
                    onClick={() =>
                      onAddPayment(worker)
                    }
                    className="rounded-xl bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700 transition hover:bg-blue-100"
                  >
                    + Add Payment
                  </button>
                </div>

              </div>
            );
          })}
        </div>
      </div>

      {/* =====================================================
          MOBILE / TABLET
      ===================================================== */}

      <div className="grid gap-4 lg:hidden">

        {filteredWorkers.map((worker) => {
          const status = getStatus(worker._id);

          return (
            <div
              key={worker._id}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
            >

              {/* Worker */}

              <div>
                <h3 className="text-lg font-bold text-slate-800">
                  {worker.name}
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  {worker.department || "-"}
                </p>
              </div>

              {/* Attendance */}

              <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">

                {/* Present */}

                <button
                  type="button"
                  onClick={() =>
                    handleStatusChange(
                      worker._id,
                      "present"
                    )
                  }
                  className={`h-11 rounded-xl font-semibold transition ${
                    status === "present"
                      ? "bg-green-600 text-white"
                      : "bg-green-100 text-green-700 hover:bg-green-200"
                  }`}
                >
                  Present
                </button>

                {/* Absent */}

                <button
                  type="button"
                  onClick={() =>
                    handleStatusChange(
                      worker._id,
                      "absent"
                    )
                  }
                  className={`h-11 rounded-xl font-semibold transition ${
                    status === "absent"
                      ? "bg-red-600 text-white"
                      : "bg-red-100 text-red-700 hover:bg-red-200"
                  }`}
                >
                  Absent
                </button>

                {/* Leave */}

                <button
                  type="button"
                  onClick={() =>
                    handleStatusChange(
                      worker._id,
                      "leave"
                    )
                  }
                  className={`h-11 rounded-xl font-semibold transition ${
                    status === "leave"
                      ? "bg-orange-500 text-white"
                      : "bg-orange-100 text-orange-700 hover:bg-orange-200"
                  }`}
                >
                  Leave
                </button>

              </div>

              {/* Payment */}

              <div className="mt-4">
                <button
                  type="button"
                  onClick={() =>
                    onAddPayment(worker)
                  }
                  className="h-11 w-full rounded-xl bg-blue-100 font-semibold text-blue-700 transition hover:bg-blue-200"
                >
                  + Add Payment
                </button>
              </div>

            </div>
          );
        })}

      </div>
    </>
  );
}

export default AttendanceTable;