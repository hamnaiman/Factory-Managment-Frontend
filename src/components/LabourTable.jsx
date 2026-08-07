import { Pencil, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";

function LabourTable({
  labours,
  search,
  onEdit,
  onDelete,
}) {
  const filteredLabours = labours.filter((labour) =>
    labour.name.toLowerCase().includes(search.toLowerCase())
  );

  if (filteredLabours.length === 0) {
    return (
      <div className="rounded-3xl bg-white p-10 text-center shadow-sm border border-slate-200">
        No workers found.
      </div>
    );
  }

  return (
    <>
      {/* ================= Desktop Table ================= */}

   {/* ================= Desktop Table ================= */}

<div className="hidden lg:block">
  <div className="overflow-x-auto rounded-3xl border border-slate-200 bg-white shadow-sm">
    <div className="min-w-[900px]">
        {/* Header */}

        <div className="grid grid-cols-12 bg-slate-50 px-6 py-4 font-semibold text-slate-700">

          <div className="col-span-3">Worker</div>

          <div className="col-span-2">Phone</div>

          <div className="col-span-2">Department</div>

          <div className="col-span-2">Daily Wage</div>

          <div className="col-span-1">Status</div>

          <div className="col-span-2 text-center">
            Actions
          </div>

        </div>

        {filteredLabours.map((labour) => (

          <div
            key={labour._id}
            className="grid grid-cols-12 items-center border-t border-slate-100 px-6 py-5 hover:bg-slate-50"
          >

            <div className="col-span-3 font-semibold">
  <Link
    to={`/labour-profile/${labour._id}`}
    className="text-[#1E3A8A] hover:underline"
  >
    {labour.name}
  </Link>
</div>

            <div className="col-span-2">
              {labour.phone}
            </div>

            <div className="col-span-2">
              {labour.department}
            </div>

            <div className="col-span-2 font-semibold">
              Rs. {labour.dailyWage}
            </div>

            <div className="col-span-1">

              <span
                className={`rounded-full px-3 py-1 text-xs font-medium ${
                  labour.status === "active"
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {labour.status}
              </span>

            </div>

            <div className="col-span-2 flex justify-center gap-3">

              <button
                onClick={() => onEdit(labour)}
                className="rounded-xl bg-blue-50 p-2 text-blue-600 hover:bg-blue-100"
              >
                <Pencil size={18} />
              </button>

              <button
                onClick={() => onDelete(labour._id)}
                className="rounded-xl bg-red-50 p-2 text-red-600 hover:bg-red-100"
              >
                <Trash2 size={18} />
              </button>

            </div>

          </div>

        ))}

      </div>
      </div>
      </div>

      {/* ================= Mobile Cards ================= */}

      <div className="grid gap-4 lg:hidden">

        {filteredLabours.map((labour) => (

          <div
            key={labour._id}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
          >

            <div className="flex items-start justify-between">

              <div>

               <Link
  to={`/labour-profile/${labour._id}`}
  className="text-lg font-bold text-[#1E3A8A] hover:underline"
>
  {labour.name}
</Link>

                <p className="mt-1 text-sm text-slate-500">
                  {labour.department}
                </p>

              </div>

              <span
                className={`rounded-full px-3 py-1 text-xs font-medium ${
                  labour.status === "active"
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {labour.status}
              </span>

            </div>

            <div className="mt-5 space-y-2 text-sm">

              <div className="flex justify-between">

                <span className="text-slate-500">
                  Phone
                </span>

                <span className="font-medium">
                  {labour.phone}
                </span>

              </div>

              <div className="flex justify-between">

                <span className="text-slate-500">
                  Daily Wage
                </span>

                <span className="font-semibold">
                  Rs. {labour.dailyWage}
                </span>

              </div>

            </div>

            <div className="mt-6 flex gap-3">

              <button
                onClick={() => onEdit(labour)}
                className="flex-1 rounded-xl bg-blue-600 py-2 text-white hover:bg-blue-700"
              >
                Edit
              </button>

              <button
                onClick={() => onDelete(labour._id)}
                className="flex-1 rounded-xl bg-red-600 py-2 text-white hover:bg-red-700"
              >
                Delete
              </button>

            </div>

          </div>

        ))}

            </div>
    </>
  );
}
export default LabourTable;