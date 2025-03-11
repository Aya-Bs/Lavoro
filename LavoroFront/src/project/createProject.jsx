import React, { useEffect, useRef } from 'react';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import Choices from 'choices.js';
import 'choices.js/public/assets/styles/choices.min.css';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';
import { FilePond, registerPlugin } from 'react-filepond';
import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
import FilePondPluginImageExifOrientation from 'filepond-plugin-image-exif-orientation';
import FilePondPluginFileValidateSize from 'filepond-plugin-file-validate-size';
import FilePondPluginFileEncode from 'filepond-plugin-file-encode';
import FilePondPluginImageEdit from 'filepond-plugin-image-edit';
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type';
import FilePondPluginImageCrop from 'filepond-plugin-image-crop';
import FilePondPluginImageResize from 'filepond-plugin-image-resize';
import FilePondPluginImageTransform from 'filepond-plugin-image-transform';
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css';
import 'filepond/dist/filepond.min.css';

// Register FilePond plugins
registerPlugin(
  FilePondPluginImagePreview,
  FilePondPluginImageExifOrientation,
  FilePondPluginFileValidateSize,
  FilePondPluginFileEncode,
  FilePondPluginImageEdit,
  FilePondPluginFileValidateType,
  FilePondPluginImageCrop,
  FilePondPluginImageResize,
  FilePondPluginImageTransform
);

export default function CreateProject() {
  const pondRef = useRef(null); // Ref for FilePond instance

  useEffect(() => {
    // Initialize flatpickr for date pickers
    flatpickr("#startDate", {
      enableTime: true,
      dateFormat: "Y-m-d H:i",
    });

    flatpickr("#endDate", {
      enableTime: true,
      dateFormat: "Y-m-d H:i",
    });

    // Initialize Choices for multi-select
    const assignedTeamMembers = document.querySelector('#assigned-team-members');
    if (assignedTeamMembers) {
      new Choices(assignedTeamMembers, {
        allowHTML: true,
        removeItemButton: true,
      });
    }

    // Initialize Quill editor
    const toolbarOptions = [
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      [{ 'font': [] }],
      ['bold', 'italic', 'underline', 'strike'],
      ['blockquote', 'code-block'],
      [{ 'header': 1 }, { 'header': 2 }],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      [{ 'script': 'sub' }, { 'script': 'super' }],
      [{ 'indent': '-1' }, { 'indent': '+1' }],
      [{ 'direction': 'rtl' }],
      [{ 'size': ['small', false, 'large', 'huge'] }],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'align': [] }],
      ['image', 'video'],
      ['clean']
    ];

    const quill = new Quill('#project-descriptioin-editor', {
      modules: {
        toolbar: toolbarOptions
      },
      theme: 'snow'
    });

    // Initialize Choices for unique values input
    const choicesTextUniqueValues = document.querySelector('#choices-text-unique-values');
    if (choicesTextUniqueValues) {
      new Choices(choicesTextUniqueValues, {
        allowHTML: true,
        paste: false,
        duplicateItemsAllowed: false,
        editItems: true,
      });
    }
  }, []);

  return (
    <>
      <div className="d-flex align-items-center justify-content-between page-header-breadcrumb flex-wrap gap-2">
        <div>
          <nav>
            <ol className="breadcrumb mb-1">
              <li className="breadcrumb-item">
                <a href="#" onClick={(e) => e.preventDefault()}>
                  Projects
                </a>
              </li>
              <span className="mx-1">→</span>
              <li className="breadcrumb-item active" aria-current="page">
                Create Project
              </li>
            </ol>
          </nav>
          <h1 className="page-title fw-medium fs-18 mb-0">Create Project</h1>
        </div>
        <div className="btn-list">
          <button className="btn btn-white btn-wave">
            <i className="ri-filter-3-line align-middle me-1 lh-1" /> Filter
          </button>
          <button className="btn btn-primary btn-wave me-0">
            <i className="ri-share-forward-line me-1" /> Share
          </button>
        </div>
      </div>
      <div className="row">
        <div className="col-xl-12">
          <div className="card custom-card">
            <div className="card-header">
              <div className="card-title">Create Project</div>
            </div>
            <div className="card-body">
              <div className="row gy-3">
                <div className="col-xl-4">
                  <label htmlFor="input-label" className="form-label">
                    Project Name :
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="input-label"
                    placeholder="Enter Project Name"
                  />
                </div>
                <div className="col-xl-4">
                  <label htmlFor="input-label11" className="form-label">
                    Project Manager :
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="input-label11"
                    placeholder="Project Manager Name"
                  />
                </div>
                <div className="col-xl-4">
                  <label htmlFor="input-label1" className="form-label">
                    Client / Stakeholder :
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="input-label1"
                    placeholder="Enter Client Name"
                  />
                </div>
                <div className="col-xl-12">
                  <label className="form-label">Project Description :</label>
                  <div id="project-descriptioin-editor">
                    <p>
                      lorem Contrary to popular belief, Lorem Ipsum is not
                      simply random text. It has roots in a piece of classical
                      Latin literature from 45 BC, making it over 2000 years
                      old. Richard McClintock, a Latin professor at
                      Hampden-Sydney College in Virginia, looked up one of the
                      more obscure Latin words, consectetur, from a Lorem
                      Ipsum passage, and going through the cites of the word
                      in classical literature, discovered the undoubtable
                      source. Lorem Ipsum comes from sections 1.10.32 and
                      1.10.33.
                    </p>
                    <p>
                      <br />
                    </p>
                    <ol>
                      <li className="ql-size-normal">
                        Ensure data security and compliance with relevant
                        regulations.
                      </li>
                      <li className="">
                        Train staff on the enhanced system within two weeks of
                        deployment.
                      </li>
                      <li className="">
                        Implement a scalable solution to accommodate future
                        growth.
                      </li>
                      <li className="">
                        Decrease the time required for inventory audits by
                        50%.
                      </li>
                      <li className="">
                        Achieve a 10% reduction in excess inventory costs.
                      </li>
                    </ol>
                  </div>
                </div>
                <div className="col-xl-6">
                  <label className="form-label">Start Date :</label>
                  <div className="form-group">
                    <div className="input-group">
                      <div className="input-group-text text-muted">
                        <i className="ri-calendar-line" />
                      </div>
                      <input
                        type="text"
                        className="form-control"
                        id="startDate"
                        placeholder="Choose date and time"
                      />
                    </div>
                  </div>
                </div>
                <div className="col-xl-6">
                  <label className="form-label">End Date :</label>
                  <div className="form-group">
                    <div className="input-group">
                      <div className="input-group-text text-muted">
                        <i className="ri-calendar-line" />
                      </div>
                      <input
                        type="text"
                        className="form-control"
                        id="endDate"
                        placeholder="Choose date and time"
                      />
                    </div>
                  </div>
                </div>
                <div className="col-xl-6">
                  <label className="form-label">Status :</label>
                  <select
                    className="form-control"
                    data-trigger=""
                    name="choices-single-default1"
                    id="choices-single-default1"
                  >
                    <option value="Inprogress" selected="">
                      Inprogress
                    </option>
                    <option value="On-hold">On-hold</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
                <div className="col-xl-6">
                  <label className="form-label">Priority :</label>
                  <select
                    className="form-control"
                    data-trigger=""
                    name="choices-single-default"
                    id="choices-single-default"
                  >
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
                <div className="col-xl-6">
                  <label className="form-label">Assigned To</label>
                  <select
                    className="form-control"
                    name="assigned-team-members"
                    id="assigned-team-members"
                    multiple=""
                  >
                    <option value="Choice 1" selected="">
                      Angelina May
                    </option>
                    <option value="Choice 2">Sarah Ruth</option>
                    <option value="Choice 3">Hercules Jhon</option>
                    <option value="Choice 4">Mayor Kim</option>
                    <option value="Choice 4" selected="">
                      Alexa Biss
                    </option>
                    <option value="Choice 4">Karley Dia</option>
                    <option value="Choice 4">Kim Jong</option>
                    <option value="Choice 4">Darren Sami</option>
                    <option value="Choice 4">Elizabeth</option>
                    <option value="Choice 4">Bear Gills</option>
                    <option value="Choice 4" selected="">
                      Phillip John
                    </option>
                  </select>
                </div>
                <div className="col-xl-6">
                  <label className="form-label">Tags</label>
                  <input
                    className="form-control"
                    id="choices-text-unique-values"
                    type="text"
                    defaultValue="Marketing, Sales, Development, Design, Research"
                    placeholder="This is a placeholder"
                  />
                </div>
                <div className="col-xl-12">
                  <label className="form-label">Attachments</label>
                  <FilePond
                    ref={pondRef}
                    allowMultiple={true}
                    maxFiles={6}
                    maxFileSize="3MB"
                    name="filepond"
                    labelIdle='Drag & Drop your files or <span class="filepond--label-action">Browse</span>'
                  />
                </div>
              </div>
            </div>
            <div className="card-footer">
              <button className="btn btn-primary-light btn-wave ms-auto float-end">
                Create Project
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
