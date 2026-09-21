import { UserProfile } from "@clerk/nextjs";

export default function ProfilePage() {
  return (
    <section aria-labelledby="profile-title" className="mx-auto max-w-4xl">
      <header className="mb-7">
        <p className="font-interface text-xs font-bold tracking-[0.14em] text-primary uppercase">
          Conta
        </p>
        <h1
          id="profile-title"
          className="mt-2 text-3xl font-semibold sm:text-4xl"
        >
          Meu perfil
        </h1>
      </header>
      <div className="overflow-hidden rounded-card border bg-surface p-2 sm:p-5">
        <UserProfile
          routing="path"
          path="/admin/perfil"
          appearance={{
            elements: {
              rootBox: "w-full",
              cardBox: "w-full shadow-none",
              card: "w-full shadow-none",
              navbar: "border-r",
            },
          }}
        />
      </div>
    </section>
  );
}
