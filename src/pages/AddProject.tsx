import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PageLayout } from "../components/layouts/PageLayout";
import { PageHeader } from "../components/shared/PageHeader";
import {
  AppButton,
  AppCard,
  AppCol,
  AppFormField,
  AppInput,
  AppRow,
  AppSelect,
  AppSpace,
  AppTag,
  AppTextArea,
} from "../components/ui";
import { Body } from "../components/ui/Typography";
import { useClientDataStore } from "../stores/clientDataStore";
import {
  useProjectsStore,
  type Project,
  type ProjectModule,
} from "../stores/projectsStore";

export default function AddProject() {
  const navigate = useNavigate();
  const { add } = useProjectsStore();
  const { clients } = useClientDataStore();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [deadline, setDeadline] = useState("");
  const [clientId, setClientId] = useState("");
  const [budget, setBudget] = useState<number | "">("");
  const [manager, setManager] = useState("");
  const [status, setStatus] = useState<"Active" | "On Hold" | "Done">("Active");
  const [modules, setModules] = useState<ProjectModule[]>([]);

  // Pobierz nazwę klienta na podstawie ID
  const selectedClient = useMemo(
    () => clients.find((c: any) => c.id === clientId),
    [clients, clientId]
  );

  const isValid = useMemo(
    () => name.trim() && clientId && deadline.trim(),
    [name, clientId, deadline]
  );

  const toggleModule = (m: ProjectModule) => {
    setModules((prev) =>
      prev.includes(m) ? prev.filter((x) => x !== m) : [...prev, m]
    );
  };

  const handleSubmit = async () => {
    if (!isValid || !selectedClient) return;

    await add({
      numer: `P-${new Date().getFullYear()}/${String(
        new Date().getMonth() + 1
      ).padStart(2, "0")}/${String(new Date().getDate()).padStart(2, "0")}`,
      name: name.trim(),
      typ: "Inne",
      lokalizacja: "Warszawa",
      clientId: clientId,
      client: selectedClient.companyName,
      status: status as Project["status"],
      data_utworzenia: new Date().toISOString().slice(0, 10),
      deadline: deadline,
      postep: 0,
      budget: budget || undefined,
      manager: manager || undefined,
      description: description || undefined,
      modules: modules.length ? modules : undefined,
      clientColor: selectedClient.cardColor,
    });
    navigate("/projekty");
  };

  return (
    <PageLayout>
      <PageHeader
        title="Dodaj Nowy Projekt"
        subtitle="Utwórz nowy projekt w systemie"
        backButton={{
          onClick: () => navigate("/projects"),
          label: "Wstecz do projektów",
        }}
        actions={
          <AppSpace>
            <AppButton onClick={() => navigate(-1)}>Anuluj</AppButton>
            <AppButton
              type="primary"
              onClick={handleSubmit}
              disabled={!isValid}
            >
              Zapisz
            </AppButton>
          </AppSpace>
        }
      />

      <AppRow gutter={[24, 24]}>
        <AppCol xs={24} xl={18}>
          <AppCard title="Informacje ogólne" style={{ marginBottom: 24 }}>
            <AppSpace
              direction="vertical"
              size="large"
              style={{ width: "100%" }}
            >
              <AppFormField name="name" label="Nazwa projektu" required>
                <AppInput
                  placeholder="Wpisz nazwę projektu"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </AppFormField>

              <AppFormField name="description" label="Opis">
                <AppTextArea
                  rows={4}
                  placeholder="Krótki opis"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </AppFormField>

              <AppRow gutter={[16, 16]}>
                <AppCol xs={24} sm={12}>
                  <AppFormField name="deadline" label="Termin" required>
                    <AppInput
                      type="date"
                      value={deadline}
                      onChange={(e) => setDeadline(e.target.value)}
                    />
                  </AppFormField>
                </AppCol>
                <AppCol xs={24} sm={12}>
                  <AppFormField name="clientId" label="Klient" required>
                    <AppSelect
                      value={clientId}
                      onChange={setClientId}
                      placeholder="Wybierz klienta"
                      options={[
                        { value: "", label: "Wybierz klienta" },
                        ...clients.map((client: any) => ({
                          value: client.id,
                          label: client.companyName,
                        })),
                      ]}
                    />
                  </AppFormField>
                </AppCol>
                <AppCol xs={24} sm={12}>
                  <AppFormField name="budget" label="Budżet (PLN)">
                    <AppInput
                      type="number"
                      min={0}
                      value={budget}
                      onChange={(e) =>
                        setBudget(
                          e.target.value === "" ? "" : Number(e.target.value)
                        )
                      }
                    />
                  </AppFormField>
                </AppCol>
                <AppCol xs={24} sm={12}>
                  <AppFormField name="manager" label="Kierownik projektu">
                    <AppInput
                      placeholder="Imię i nazwisko"
                      value={manager}
                      onChange={(e) => setManager(e.target.value)}
                    />
                  </AppFormField>
                </AppCol>
              </AppRow>
            </AppSpace>
          </AppCard>

          <AppCard title="Zasoby">
            <Body color="muted">
              Dodawanie plików i załączników będzie dostępne w kolejnej
              iteracji.
            </Body>
          </AppCard>
        </AppCol>

        <AppCol xs={24} xl={6}>
          <AppCard
            title={
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <span>Status</span>
                <AppTag color="blue">{status}</AppTag>
              </div>
            }
            style={{ marginBottom: 24 }}
          >
            <AppFormField name="status" label="Status projektu">
              <AppSelect
                value={status}
                onChange={setStatus}
                options={[
                  { value: "Active", label: "Active" },
                  { value: "On Hold", label: "On Hold" },
                  { value: "Done", label: "Done" },
                ]}
              />
            </AppFormField>
          </AppCard>

          <AppCard title="Moduły" style={{ marginBottom: 24 }}>
            <AppSpace
              direction="vertical"
              size="small"
              style={{ width: "100%" }}
            >
              {(
                [
                  "wycena",
                  "koncepcja",
                  "projektowanie_techniczne",
                  "produkcja",
                  "materialy",
                  "logistyka_montaz",
                ] as ProjectModule[]
              ).map((m) => (
                <label
                  key={m}
                  style={{ display: "flex", alignItems: "center", gap: "8px" }}
                >
                  <input
                    type="checkbox"
                    checked={modules.includes(m)}
                    onChange={() => toggleModule(m)}
                  />
                  <Body>{m.replace("_", " ")}</Body>
                </label>
              ))}
            </AppSpace>
          </AppCard>

          <AppCard title="Obraz">
            <div
              style={{
                height: 160,
                border: "1px solid var(--border-main)",
                borderRadius: 6,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "var(--bg-secondary)",
              }}
            >
              <Body color="muted" style={{ textAlign: "center", fontSize: 12 }}>
                Drag & drop / kliknij aby dodać (placeholder)
              </Body>
            </div>
          </AppCard>
        </AppCol>
      </AppRow>
    </PageLayout>
  );
}
