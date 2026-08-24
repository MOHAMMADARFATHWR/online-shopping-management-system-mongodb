import React from 'react';

export function ProductSkeletonCard() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-4 space-y-3 shadow-sm animate-pulse">
      <div className="w-full aspect-square bg-gray-200 rounded-xl" />
      <div className="h-3 bg-gray-200 rounded w-1/4" />
      <div className="h-4 bg-gray-200 rounded w-3/4" />
      <div className="h-3 bg-gray-200 rounded w-1/2" />
      <div className="flex justify-between items-center pt-2">
        <div className="h-5 bg-gray-200 rounded w-1/3" />
        <div className="h-8 bg-gray-200 rounded-xl w-20" />
      </div>
    </div>
  );
}

export function TableRowSkeleton({ columns = 5 }) {
  return (
    <tr className="animate-pulse border-b border-gray-100">
      {Array.from({ length: columns }).map((_, i) => (
        <td key={i} className="py-4 px-4">
          <div className="h-4 bg-gray-200 rounded w-2/3" />
        </td>
      ))}
    </tr>
  );
}

export function StatCardSkeleton() {
  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm animate-pulse space-y-3">
      <div className="flex justify-between items-center">
        <div className="h-3 bg-gray-200 rounded w-1/3" />
        <div className="w-10 h-10 bg-gray-200 rounded-xl" />
      </div>
      <div className="h-8 bg-gray-200 rounded w-1/2" />
      <div className="h-3 bg-gray-200 rounded w-2/3" />
    </div>
  );
}
