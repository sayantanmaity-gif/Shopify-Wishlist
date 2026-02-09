import { useLoaderData } from "react-router";
import prisma from "../db.server";
import { useState } from "react";
import { Form, useActionData } from "react-router";

export const loader = async () => {
  const settings = await prisma.settings.findFirst();
  return JSON.stringify({ settings });
};

export const action = async ({ request }) => {
  const formData = await request.formData();
  const settings = Object.fromEntries(formData);
  // console.log("Form data", formEntries);
  await prisma.settings.upsert({
    where: { id: '1' },
    update: {
      id: '1',
      storeName: settings.storeName,
      businessAddress: settings.businessAddress,
    },
    create: {
      id: '1',
      storeName: settings.storeName,
      businessAddress: settings.businessAddress,
    }
  });
  return { success: true };
};

// export default function SettingsPage() {
//   const settings = useLoaderData();
//   const [formData, setFormData] = useState(settings)
//   const actionData = useActionData();
//   // console.log("Settings", settings);
//   return (
//     <Form method="post"
//       data-save-bar
//       onSubmit={(event) => {
//         event.preventDefault();
//         const formData = new FormData(event.target);
//         const formEntries = Object.fromEntries(formData);
//         console.log("Form data", formEntries);
//       }}
//       onReset={() => {
//         console.log("Handle discarded changes if necessary");
//       }}
//     >
//       <s-page heading="Settings" inlineSize="small">
//         {/* === */}
//         {/* Store Information */}
//         {/* === */}
//         <s-section heading="Store Information">
//           <s-text-field
//             label="Store name"
//             name="store-name"
//             value={formData?.storeName} onChange={(event) => setFormData({ ...formData, storeName: event.target.value })}
//             placeholder="Enter store name"
//           />
//           <s-text-field
//             label="Business address"
//             name="business-address"
//             value={formData?.businessAddress} onChange={(event) => setFormData({ ...formData, businessAddress: event.target.value })}
//             placeholder="Enter business address"
//           />
//         </s-section>

//         {/* === */}
//   </s-page>
// </Form>
//   );
// }

export default function SettingsPage() {
  const { settings } = JSON.parse(useLoaderData());
  const [formData, setFormData] = useState(settings ?? {});

  return (
    <Form method="post" data-save-bar>
      <s-page heading="Settings" inlineSize="small">
        <s-section heading="Store Information">
          <s-text-field
            label="Store name"
            name="storeName"
            value={formData?.storeName ?? ""}
            onChange={(event) =>
              setFormData({ ...formData, storeName: event.target.value })
            }
          />
          <s-text-field
            label="Business address"
            name="businessAddress"
            value={formData?.businessAddress ?? ""}
            onChange={(event) =>
              setFormData({ ...formData, businessAddress: event.target.value })
            }
          />
        </s-section>
      </s-page>
    </Form>
  );
}
