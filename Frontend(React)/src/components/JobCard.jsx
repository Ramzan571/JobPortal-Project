function JobCard({ job }) {
  const postedDate = new Date(job.postedDate).toLocaleDateString("en-PK", {
    day: "numeric", month: "short", year: "numeric"
  });

  const dueDate = new Date(job.dueDate).toLocaleDateString("en-PK", {
    day: "numeric", month: "short", year: "numeric"
  });

  const isExpired = job.isExpired; // Backend se aa raha hai

  return (
    <div className={`bg-white rounded-xl shadow-md p-6 border-l-4 hover:shadow-lg transition-all
      ${isExpired ? "border-red-400 opacity-70" : "border-blue-500"}`}>

      {/* Title + Badge */}
      <div className="flex justify-between items-start mb-3">
        <h4 className="text-lg font-bold text-gray-800">{job.title}</h4>
        {isExpired ? (
          <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full font-semibold">
            Expired
          </span>
        ) : (
          <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded-full font-semibold">
            Active
          </span>
        )}
      </div>

      {/* Location & Salary */}
      <p className="text-gray-500 text-sm mb-1">📍 {job.location}</p>
      <p className="text-gray-500 text-sm mb-4">💰 PKR {job.salary?.toLocaleString()}</p>

      {/* Description */}
      <p className="text-gray-600 text-sm mb-4 line-clamp-2">{job.description}</p>

      {/* Dates */}
      <div className="border-t pt-3 flex justify-between text-xs text-gray-400">
        <span>📅 Posted: {postedDate}</span>
        <span className={isExpired ? "text-red-400 font-semibold" : "text-orange-500 font-semibold"}>
          ⏰ Due: {dueDate}
        </span>
      </div>

      {/* Apply Button */}
      {!isExpired && (
        <a href="/login"
          className="mt-4 block text-center bg-blue-600 text-white py-2 rounded-lg
          hover:bg-blue-700 transition-colors text-sm font-medium">
          Apply Now → Login Required
        </a>
      )}
      {isExpired && (
        <div className="mt-4 text-center text-red-400 text-sm font-medium py-2">
          Applications Closed
        </div>
      )}
    </div>
  );
}