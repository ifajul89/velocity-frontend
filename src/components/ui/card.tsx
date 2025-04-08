import React, { ReactNode } from 'react';

export const Card = ({ children }: { children: ReactNode }) => (
  <div className="bg-white shadow rounded-lg">{children}</div>
);

export const CardHeader = ({ children }: { children: ReactNode }) => (
  <div className="border-b p-4">{children}</div>
);

export const CardTitle = ({ children }: { children: ReactNode }) => (
  <h2 className="text-lg font-bold">{children}</h2>
);

export const CardDescription = ({ children }: { children: ReactNode }) => (
  <p className="text-sm text-gray-600">{children}</p>
);

export const CardContent = ({ children }: { children: ReactNode }) => (
  <div className="p-4">{children}</div>
);

export const CardFooter = ({ children }: { children: ReactNode }) => (
  <div className="border-t p-4">{children}</div>
); 