import { Pencil, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";

function ClientTable({
  clients,
  search,
  onEdit,
  onDelete,
}) {
  const filteredClients = clients.filter((client) =>
client.clientName.toLowerCase().includes(search.toLowerCase())
  );

  if (filteredClients.length === 0) {
    return (
      <div className="rounded-3xl bg-white p-10 text-center shadow-sm border border-slate-200">
        No clients found.
      </div>
    );
  }

  return (
    <>
      {/* ================= Desktop Table ================= */}

      <div className="hidden lg:block">
  <div className="overflow-x-auto rounded-3xl border border-slate-200 bg-white shadow-sm">
    <div className="min-w-[900px]">

            <div className="grid grid-cols-12 bg-slate-50 px-6 py-4 font-semibold text-slate-700">

              <div className="col-span-3">Client</div>

              <div className="col-span-2">Phone</div>

              <div className="col-span-2">Outstanding</div>

              <div className="col-span-2">Purchases</div>

              <div className="col-span-1">Status</div>

              <div className="col-span-2 text-center">
                Actions
              </div>

            </div>

            {filteredClients.map((client) => (

              <div
                key={client._id}
                className="grid grid-cols-12 items-center border-t border-slate-100 px-6 py-5 hover:bg-slate-50"
              >

                <div className="col-span-3 font-semibold">
                 <Link
 to={`/client-profile/${client._id}`}
  className="text-[#1E3A8A] hover:underline"
>
  {client.clientName}
</Link>
                </div>

                <div className="col-span-2">
                  {client.phoneNumber}
                </div>

                <div className="col-span-2 font-semibold text-red-600">
                  Rs. {client.outstandingBalance || 0}
                </div>

                <div className="col-span-2 font-semibold">
                  Rs. {client.totalPurchases || 0}
                </div>

                <div className="col-span-1">

                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium ${
                      client.status === "active"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {client.status}
                  </span>

                </div>

                <div className="col-span-2 flex justify-center gap-3">

                  <button
                    onClick={() => onEdit(client)}
                    className="rounded-xl bg-blue-50 p-2 text-blue-600 hover:bg-blue-100"
                  >
                    <Pencil size={18} />
                  </button>

                  <button
                    onClick={() => onDelete(client._id)}
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

        {filteredClients.map((client) => (

          <div
            key={client._id}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
          >

            <div className="flex items-start justify-between">

              <div>

        <Link
  to={`/client-profile/${client._id}`}
  className="text-lg font-bold text-[#1E3A8A] hover:underline"
>
  {client.clientName}
</Link>

                <p className="mt-1 text-sm text-slate-500">
                 {client.phoneNumber}
                </p>

              </div>

              <span
                className={`rounded-full px-3 py-1 text-xs font-medium ${
                  client.status === "active"
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {client.status}
              </span>

            </div>

            <div className="mt-5 space-y-2 text-sm">

              <div className="flex justify-between">
                <span className="text-slate-500">
                  Outstanding
                </span>

                <span className="font-semibold text-red-600">
                  Rs. {client.outstandingBalance || 0}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-slate-500">
                  Purchases
                </span>

                <span className="font-semibold">
                  Rs. {client.totalPurchases || 0}
                </span>
              </div>

            </div>

            <div className="mt-6 flex gap-3">

              <button
                onClick={() => onEdit(client)}
                className="flex-1 rounded-xl bg-blue-600 py-2 text-white hover:bg-blue-700"
              >
                Edit
              </button>

              <button
                onClick={() => onDelete(client._id)}
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

export default ClientTable;