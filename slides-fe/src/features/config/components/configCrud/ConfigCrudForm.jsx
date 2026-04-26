import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Grid } from "@mui/material";
import InputField from "../../../../components/form-controls/input/textfield";
import CheckboxField from "../../../../components/form-controls/input/checkbox";
import CustomButton from "../../../../components/form-controls/buttons/customButton";
import { showToastNotification } from "../../../../helpers/notificationsHepler";
import "./configCrud.css";

const ConfigCrudForm = ({
  singularLabel,
  collectionLabel,
  routeBase,
  findById,
  createItem,
  updateItem,
  deleteItem,
}) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");
  const isEditing = Boolean(id);

  const [formData, setFormData] = useState({
    name: "",
    is_active: true,
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadRecord = async () => {
      if (!id) {
        setFormData({ name: "", is_active: true });
        return;
      }

      setIsLoading(true);
      try {
        const record = await findById(id);
        setFormData({
          name: record?.name || "",
          is_active: record?.is_active ?? true,
        });
      } catch (error) {
        showToastNotification("error", `Failed to load ${singularLabel.toLowerCase()}`);
      } finally {
        setIsLoading(false);
      }
    };

    loadRecord();
  }, [id, findById, singularLabel]);

  const meta = useMemo(
    () => [
      { label: "Mode", value: isEditing ? "Edit" : "Create" },
      { label: "Collection", value: collectionLabel },
      { label: "Status", value: formData.is_active ? "Active" : "Inactive" },
    ],
    [collectionLabel, formData.is_active, isEditing]
  );

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleChecked = () => {
    setFormData((prev) => ({ ...prev, is_active: !prev.is_active }));
  };

  const handleReset = () => {
    setFormData({ name: "", is_active: true });
  };

  const handleSubmit = async () => {
    if (!formData.name.trim()) {
      showToastNotification("error", `${singularLabel} name is required`);
      return;
    }

    setIsLoading(true);
    try {
      if (isEditing) {
        await updateItem(id, formData);
        showToastNotification("success", `${singularLabel} updated successfully`);
      } else {
        await createItem(formData);
        showToastNotification("success", `${singularLabel} created successfully`);
      }
      navigate(`${routeBase}/list`);
    } catch (error) {
      showToastNotification("error", `Failed to save ${singularLabel.toLowerCase()}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!id) return;

    setIsLoading(true);
    try {
      await deleteItem(id);
      showToastNotification("success", `${singularLabel} deleted successfully`);
      navigate(`${routeBase}/list`);
    } catch (error) {
      showToastNotification("error", `Failed to delete ${singularLabel.toLowerCase()}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="config-crud page-section">
      <header className="config-crud__hero page-card">
        <div>
          <span className="page-header__eyebrow">{isEditing ? "Edit Record" : "Create Record"}</span>
          <h1>{isEditing ? `Update ${singularLabel}` : `Create ${singularLabel}`}</h1>
          <p>
            Keep the {collectionLabel.toLowerCase()} collection clean and consistent with a compact,
            modern CRUD workflow.
          </p>
        </div>

        <div className="config-crud__hero-actions">
          <CustomButton label={`View ${collectionLabel}`} handleClick={() => navigate(`${routeBase}/list`)} />
          <CustomButton label="Reset" handleClick={handleReset} variant="outlined" />
        </div>
      </header>

      <div className="config-crud__meta">
        {meta.map((item) => (
          <article key={item.label} className="page-card config-crud__meta-card">
            <span>{item.label}</span>
            <strong>{item.value}</strong>
          </article>
        ))}
      </div>

      <div className="config-crud__form-shell">
        <article className="page-card config-crud__form-card">
          <div className="config-crud__form-topline">
            <div>
              <h2>{singularLabel} Details</h2>
              <p>Use a clean, canonical name so lists and selectors stay consistent.</p>
            </div>
            <span className="config-crud__badge">{collectionLabel}</span>
          </div>

          <Grid container spacing={2.5}>
            <Grid item xs={12} md={8}>
              <InputField
                id="name"
                name="name"
                value={formData.name}
                placeholder={`${singularLabel} name`}
                label={`${singularLabel} Name`}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <CheckboxField
                id="is_active"
                name="is_active"
                label="Active"
                checked={formData.is_active}
                onChange={handleChecked}
                width={220}
              />
            </Grid>
          </Grid>

          <div className="config-crud__form-actions">
            {isEditing && (
              <CustomButton
                label="Delete"
                color="error"
                variant="outlined"
                handleClick={handleDelete}
                disabled={isLoading}
              />
            )}
            <CustomButton
              label={isLoading ? "Saving..." : isEditing ? "Update" : "Create"}
              handleClick={handleSubmit}
              disabled={isLoading}
            />
          </div>
        </article>
      </div>
    </section>
  );
};

export default ConfigCrudForm;
