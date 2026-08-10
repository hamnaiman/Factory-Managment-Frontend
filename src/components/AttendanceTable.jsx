function AttendanceTable({
  workers,
  attendance,
  search,
  onStatusChange,
  onAddPayment,
}) {
  const filteredWorkers = workers.filter((worker) =>
    worker.name.toLowerCase().includes(search.toLowerCase())
  );

  if (filteredWorkers.length === 0) {
    return (
      <div className="p-10 text-center text-slate-500">
        No workers found.
      </div>
    );
  }

  const getStatus = (workerId) =>
    attendance.find(
      (item) => item.worker === workerId
    )?.status || "";

  return (
    <>
      {/* ================= Desktop ================= */}

      <div className="hidden lg:block">
        <div className="w-full rounded-2xl border border-slate-200 bg-white shadow-sm">

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

          {filteredWorkers.map((worker) => (
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
                <span className="truncate block">
                  {worker.department || "-"}
                </span>
              </div>

              {/* Attendance */}

              <div className="col-span-4">
                <div className="flex items-center justify-center gap-5">

                  {/* Present */}

                  <label className="flex cursor-pointer items-center gap-2 whitespace-nowrap">
                    <input
                      type="checkbox"
                      checked={
                        getStatus(worker._id) === "present"
                      }
                      onChange={() =>
                        onStatusChange(
                          worker._id,
                          getStatus(worker._id) === "present"
                            ? ""
                            : "present"
                        )
                      }
                      className="h-4 w-4"
                    />

                    <span className="text-sm font-medium text-green-600">
                      Present
                    </span>
                  </label>

                  {/* Absent */}

                  <label className="flex cursor-pointer items-center gap-2 whitespace-nowrap">
                    <input
                      type="checkbox"
                      checked={
                        getStatus(worker._id) === "absent"
                      }
                      onChange={() =>
                        onStatusChange(
                          worker._id,
                          getStatus(worker._id) === "absent"
                            ? ""
                            : "absent"
                        )
                      }
                      className="h-4 w-4"
                    />

                    <span className="text-sm font-medium text-red-600">
                      Absent
                    </span>
                  </label>

                  {/* Leave */}

                  <label className="flex cursor-pointer items-center gap-2 whitespace-nowrap">
                    <input
                      type="checkbox"
                      checked={
                        getStatus(worker._id) === "leave"
                      }
                      onChange={() =>
                        onStatusChange(
                          worker._id,
                          getStatus(worker._id) === "leave"
                            ? ""
                            : "leave"
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
                  onClick={() => onAddPayment(worker)}
                  className="rounded-xl bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700 transition hover:bg-blue-100"
                >
                  + Add Payment
                </button>
              </div>

            </div>
          ))}

        </div>
      </div>

      {/* ================= Mobile + Tablet ================= */}

      <div className="grid gap-4 lg:hidden">

        {filteredWorkers.map((worker) => (
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

              <button
                type="button"
                onClick={() =>
                  onStatusChange(
                    worker._id,
                    getStatus(worker._id) === "present"
                      ? ""
                      : "present"
                  )
                }
                className={`h-11 rounded-xl font-semibold transition ${
                  getStatus(worker._id) === "present"
                    ? "bg-green-600 text-white"
                    : "bg-green-100 text-green-700 hover:bg-green-200"
                }`}
              >
                Present
              </button>

              <button
                type="button"
                onClick={() =>
                  onStatusChange(
                    worker._id,
                    getStatus(worker._id) === "absent"
                      ? ""
                      : "absent"
                  )
                }
                className={`h-11 rounded-xl font-semibold transition ${
                  getStatus(worker._id) === "absent"
                    ? "bg-red-600 text-white"
                    : "bg-red-100 text-red-700 hover:bg-red-200"
                }`}
              >
                Absent
              </button>

              <button
                type="button"
                onClick={() =>
                  onStatusChange(
                    worker._id,
                    getStatus(worker._id) === "leave"
                      ? ""
                      : "leave"
                  )
                }
                className={`h-11 rounded-xl font-semibold transition ${
                  getStatus(worker._id) === "leave"
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
                onClick={() => onAddPayment(worker)}
                className="h-11 w-full rounded-xl bg-blue-100 font-semibold text-blue-700 transition hover:bg-blue-200"
              >
                + Add Payment
              </button>
            </div>

          </div>
        ))}

      </div>
    </>
  );
}

export default AttendanceTable;