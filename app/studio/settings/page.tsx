import { updateSiteSettings } from "@/app/studio/actions";
import { getStudioBootstrapData } from "@/lib/cms/queries";
import { requireStudioRole } from "@/lib/studio-auth";

export default async function StudioSettingsPage() {
  await requireStudioRole(["owner", "admin"]);
  const data = await getStudioBootstrapData();
  const settings = data.settings;

  return (
    <section className="space-y-6">
      <header>
        <h1 className="font-serif text-4xl text-[var(--forest)]">Site Settings</h1>
        <p className="mt-2 text-sm text-[var(--muted)]">Manage business profile, contact details, social links, and default SEO.</p>
      </header>

      <form action={updateSiteSettings} className="rounded-xl border border-[var(--line)] bg-white p-5">
        <div className="grid gap-3 md:grid-cols-2">
          <Field label="Business name" name="business_name" value={settings.business_name || ""} />
          <Field label="Tagline" name="business_tagline" value={settings.business_tagline || ""} />
          <Field label="Contact email" name="contact_email" value={settings.contact_email || ""} />
          <Field label="Contact phone" name="contact_phone" value={settings.contact_phone || ""} />
          <Field label="Address line 1" name="address_line_1" value={settings.address_line_1 || ""} />
          <Field label="Address line 2" name="address_line_2" value={settings.address_line_2 || ""} />
          <Field label="Opening hours" name="opening_hours" value={settings.opening_hours || ""} />
          <Field label="Instagram URL" name="instagram_url" value={settings.instagram_url || ""} />
          <Field label="Facebook URL" name="facebook_url" value={settings.facebook_url || ""} />
          <Field label="Pinterest URL" name="pinterest_url" value={settings.pinterest_url || ""} />
          <Field label="Default SEO title" name="default_seo_title" value={settings.default_seo_title || ""} />
          <Field
            label="Default SEO description"
            name="default_seo_description"
            value={settings.default_seo_description || ""}
          />
          <label className="space-y-1 text-sm md:col-span-2">
            <span>Footer text</span>
            <textarea
              name="footer_text"
              rows={3}
              defaultValue={settings.footer_text || ""}
              className="w-full rounded-md border border-[var(--line)] px-3 py-2"
            />
          </label>
        </div>

        <button className="mt-4 rounded-md bg-[var(--forest)] px-4 py-2 font-semibold text-white">Save settings</button>
      </form>
    </section>
  );
}

function Field({ label, name, value }: { label: string; name: string; value: string }) {
  return (
    <label className="space-y-1 text-sm">
      <span>{label}</span>
      <input name={name} defaultValue={value} className="w-full rounded-md border border-[var(--line)] px-3 py-2" />
    </label>
  );
}
