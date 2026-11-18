import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useNavigate, useSearchParams } from "react-router-dom";
import InputField from "../../../../components/form-controls/input/textfield";
import CheckboxField from "../../../../components/form-controls/input/checkbox";
import CustomButton from "../../../../components/form-controls/buttons/customButton";
import PageHeader from "../../../../components/common/PageHeader";
import { ChevronLeftIcon, RefreshIcon } from "../../../../components/icons";
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
      <PageHeader
        title={isEditing ? `Edit ${singularLabel.toLowerCase()}` : `Create ${singularLabel.toLowerCase()}`}
        meta={collectionLabel}
        actions={
          <>
            <button type="button" className="ui-btn" onClick={() => navigate(`${routeBase}/list`)}>
              <ChevronLeftIcon fontSize="small" /> Back to {collectionLabel.toLowerCase()}
            </button>
            <button type="button" className="ui-btn" onClick={handleReset}>
              <RefreshIcon fontSize="small" /> Reset
            </button>
          </>
        }
      />

      <div className="config-crud__form-shell">
        <article className="rounded-2xl border border-border-soft bg-bg-surface p-6 shadow-soft">
          <div className="config-crud__form-topline flex justify-between items-center pb-4 mb-4 border-b border-border-soft">
            <div>
              <h2 className="text-lg font-bold text-text-primary">{singularLabel} Details</h2>
              <p className="text-xs text-text-secondary mt-0.5">
                Use a clean, canonical name so lists and selectors stay consistent.
              </p>
            </div>
            <span className="chip chip--brand">
              {collectionLabel}
            </span>
          </div>

          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-12 md:col-span-8">
              <InputField
                id="name"
                name="name"
                value={formData.name}
                placeholder={`${singularLabel} name`}
                label={`${singularLabel} Name`}
                onChange={handleChange}
              />
            </div>
            <div className="col-span-12 md:col-span-4 flex items-center pt-5">
              <CheckboxField
                id="is_active"
                name="is_active"
                label="Active"
                checked={formData.is_active}
                onChange={handleChecked}
                width={220}
              />
            </div>
          </div>

          <div className="config-crud__form-actions flex justify-end gap-3 mt-6 pt-4 border-t border-border-soft">
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

ConfigCrudForm.propTypes = {
  singularLabel: PropTypes.string.isRequired,
  collectionLabel: PropTypes.string.isRequired,
  routeBase: PropTypes.string.isRequired,
  findById: PropTypes.func.isRequired,
  createItem: PropTypes.func.isRequired,
  updateItem: PropTypes.func.isRequired,
  deleteItem: PropTypes.func.isRequired,
};

export default ConfigCrudForm;
