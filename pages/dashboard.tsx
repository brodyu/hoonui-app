import { useEffect, useState } from 'react';
import { useAuth } from '@clerk/nextjs';
import DashboardHeader from '../components/dashboard/dashboard-header';
import Container from '../components/container';
import { createClient } from '@supabase/supabase-js';

export default function Dashboard() {
  const [invoices, setInvoices] = useState(null);
  const [invoiceSignedURL, setInvoiceSignedURL] = useState(null);
  const { isLoaded, userId, sessionId, getToken } = useAuth();

  async function getAllInvoices() {
    const supabaseAccessToken = await getToken({ template: 'supabase' });
    // Database connection
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_PROJECT_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_API_KEY;

    if (!supabaseUrl || !supabaseKey) {
      throw new Error("Environment variables SUPABASE_PROJECT_URL or SUPABASE_API_KEY are not defined");
    }

    const supabase = createClient(supabaseUrl, supabaseKey, {
      global: { headers: { Authorization: `Bearer ${supabaseAccessToken}` } },
    });

    const { data, error } = await supabase
      .from('invoices')
      .select('*')
      .eq('user_id', userId);

    if (error) {
      console.error('Error fetching data: ', error);
      return;
    }

    // @ts-ignore
    setInvoices(data);
  }

  async function downloadInvoice(file_path: string) {
    const supabaseAccessToken = await getToken({ template: 'supabase' });
    // Database connection
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_PROJECT_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_API_KEY;

    if (!supabaseUrl || !supabaseKey) {
      throw new Error("Environment variables SUPABASE_PROJECT_URL or SUPABASE_API_KEY are not defined");
    }

    const supabase = createClient(supabaseUrl, supabaseKey, {
      global: { headers: { Authorization: `Bearer ${supabaseAccessToken}` } },
    });

    file_path = String(file_path).replace('.js', '');
    const { data, error } = await supabase.storage
      .from('hoonui_technologies')
      .createSignedUrl(`${userId}/${file_path}`, 1000, {
        download: true,
      });

    if (error) {
      console.error('Error fetching data: ', error);
      return;
    }
    if (data && data.signedUrl) {
      setInvoiceSignedURL(data.signedUrl);
    }

  }

  useEffect(() => {
    if (isLoaded && userId) {
      getAllInvoices().catch((error) => {
        console.error("An error occurred:", error);
      });
    }
  }, [isLoaded, userId, getToken]);

  const onDownloadClick = async (fileName) => {
    try {
      downloadInvoice(fileName)

      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = invoiceSignedURL;

      // Set the downloadable file name
      a.download = fileName;

      // Append the anchor tag to the document body
      document.body.appendChild(a);

      // Trigger a click event on the anchor tag
      a.click();

      // Clean up
      document.body.removeChild(a);

    } catch (error) {
      console.error('There has been a problem with your fetch operation:', error);
    }
  };

  // In case the user signs out while on the page.
  if (!isLoaded || !userId) {
    return null;
  }

  return (
    <Container>
      <DashboardHeader />
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {/* header row */}
            {["Invoice Number", "Name", "Date of Issue", "Hours", "Action"].map((header) => (
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {invoices?.map((user) => (
            <tr key={user.invoice_id}>
              {/* data row */}
              {[user.invoice_number, user.name, user.date_of_issue, user.hours].map((item) => (
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {item}
                </td>
              ))}
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <a
                  href="#"
                  className="font-medium text-blue-600 dark:text-blue-500 hover:underline cursor-pointer"
                  onClick={(e) => {
                    e.preventDefault();
                    onDownloadClick(user.name);
                  }}
                >
                  Download
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Container>
  );
}