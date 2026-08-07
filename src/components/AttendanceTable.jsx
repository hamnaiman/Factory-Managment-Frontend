function AttendanceTable({
  workers,
  attendance,
  search,
  onStatusChange,
}) {
  const filteredWorkers = workers.filter((worker) =>
    worker.name.toLowerCase().includes(search.toLowerCase())
  );

  if (filteredWorkers.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
        <p className="text-slate-500">No workers found.</p>
      </div>
    );
  }

  const getStatus = (workerId) =>
  attendance.find((item) => item.worker === workerId)?.status || "";
  return (
    <>
      {/* ================= Desktop / Tablet ================= */}

      <div className="hidden lg:block">
        <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="min-w-[900px]">
            {/* Header */}

            <div className="grid grid-cols-12 border-b border-slate-200 bg-slate-50 px-6 py-4 font-semibold text-slate-700">
              <div className="col-span-4">Worker</div>

              <div className="col-span-3">Department</div>

              <div className="col-span-5 text-center">
                Attendance
              </div>
            </div>

            {/* Rows */}

            {filteredWorkers.map((worker) => (
              <div
                key={worker._id}
                className="grid grid-cols-12 items-center border-b border-slate-100 px-6 py-5 hover:bg-slate-50 transition"
              >
                <div className="col-span-4">
                  <h3 className="font-semibold text-slate-800">
                    {worker.name}
                  </h3>
                </div>

                <div className="col-span-3 text-slate-500">
                  {worker.department}
                </div>

                <div className="col-span-5">
                  <div className="flex justify-center gap-8">
                    <label className="flex cursor-pointer items-center gap-2 whitespace-nowrap">
                      <input
  type="checkbox"
  checked={getStatus(worker._id) === "present"}
  onChange={() =>
    onStatusChange(
      worker._id,
      getStatus(worker._id) === "present"
        ? ""
        : "present"
    )
  }
/>
                      <span className="font-medium text-green-600">
                        Present
                      </span>
                    </label>

                    <label className="flex cursor-pointer items-center gap-2 whitespace-nowrap">
                    <input
  type="checkbox"
  checked={getStatus(worker._id) === "absent"}
  onChange={() =>
    onStatusChange(
      worker._id,
      getStatus(worker._id) === "absent"
        ? ""
        : "absent"
    )
  }
/>

                      <span className="font-medium text-red-600">
                        Absent
                      </span>
                    </label>

                    <label className="flex cursor-pointer items-center gap-2 whitespace-nowrap">
<input
  type="checkbox"
  checked={getStatus(worker._id) === "leave"}
  onChange={() =>
    onStatusChange(
      worker._id,
      getStatus(worker._id) === "leave"
        ? ""
        : "leave"
    )
  }
/>

                      <span className="font-medium text-orange-500">
                        Leave
                      </span>
                    </label>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ================= Mobile + Tablet ================= */}

      <div className="grid gap-4 lg:hidden">
        {filteredWorkers.map((worker) => (
          <div
            key={worker._id}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <div>
              <h3 className="text-lg font-bold text-slate-800">
                {worker.name}
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                {worker.department}
              </p>
            </div>

            <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
              <button
                onClick={() =>
                  onStatusChange(worker._id, "present")
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
                onClick={() =>
                  onStatusChange(worker._id, "absent")
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
                onClick={() =>
                  onStatusChange(worker._id, "leave")
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
          </div>
        ))}
      </div>
    </>
  );
}

export default AttendanceTable;