import React, { useEffect, useState, useCallback } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "quill/dist/quill.snow.css";
import config from "../../config";
import DropdownMenu from "../helpers/selectCoin/SelectCoin";
import "./analysis.css";
import RichTextEditor from "../helpers/textEditor/textEditor";
import Swal from "sweetalert2";
import { AllNarrativeTrading } from "./AllNarrativeTrading";
import GeneralNarrativeTrading from "./GeneralNarrativeTrading";
import ScheduledJob from "./ScheduledJob";
import CategoryDropdown from "./CategoryDropdown";
import NoData from "src/components/NoData";
import Title from "src/components/commons/Title";

const NarrativeTrading = () => {
  const [selectedCoin, setSelectedCoin] = useState(null);
  const [selectedImage, setSelectedImage] = useState([]);
  const [content, setContent] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [items, setItems] = useState([]);
  const [isNarrativeTradingCreated, setIsNarrativeTradingCreated] =
    useState(false);
  const [showPostLaterSection, setShowPostLaterSection] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [scheduledJobs, setScheduledJobs] = useState([]);
  const [title, setTitle] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  const deleteScheduled = async (jobId) => {
    try {
      const response = await fetch(
        `${config.BASE_URL}/delete_scheduled_narrative_job/${jobId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            "ngrok-skip-browser-warning": "true",
            "X-Api-Key": config.X_API_KEY,
          },
        },
      );

      if (response.ok) {
        Swal.fire({
          icon: "success",
          title: "Scheduled Post deleted successfully",
          showConfirmButton: false,
          timer: 1000,
          customClass: "swal",
        });
        // Actualiza la lista de trabajos programados después de eliminar uno
        handleGetJobs();
      } else {
        Swal.fire({
          icon: "error",
          title: "Scheduled Post cannot delete successfully",
          showConfirmButton: false,
          timer: 1000,
          customClass: "swal",
        });
        console.error("Error deleting scheduled job:", response.statusText);
      }
    } catch (error) {
      console.error("Error deleting scheduled job:", error);
    }
  };

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
  };

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  const handleSelectCoin = (coinId) => {
    setSelectedCoin(coinId);
  };

  const handleImageSelect = (image) => {
    setSelectedImage(image);
  };

  const handleContentChange = (content) => {
    setContent(content);
  };

  const handleDateChange = (date) => {
    console.log("date selected: ", date);
    setSelectedDate(date);
  };

  // Define fetchNarrativeTrading as a useCallback to prevent unnecessary re-renders
  const fetchNarrativeTrading = useCallback(async () => {
    try {
      const response = await fetch(
        `${config.BASE_URL}/get_narrative_trading/${selectedCoin}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "ngrok-skip-browser-warning": "true",
            "X-Api-Key": config.X_API_KEY,
          },
        },
      );

      const data = await response.json();

      if (response.ok) {
        setItems(data.data);
        setSelectedImage("");
      } else {
        console.error("Error fetching coin bots:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching coin bots:", error);
    }
  }, [selectedCoin]); // selectedCoin is added as a dependency

  const fetchCoinsByCategory = async (category) => {
    try {
      const response = await fetch(
        `${config.BASE_URL}/get_bot_ids_by_category/${category}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json", "X-Api-Key": config.X_API_KEY, },
        },
      );
      const data = await response.json();
      console.log("fetch: ", data);
      if (response.ok) {
        return data.data.bot_ids; // Assuming the API returns a list of coins
      } else {
        console.error("Error fetching coins by category:", response.statusText);
        return [];
      }
    } catch (error) {
      console.error("Error fetching coins by category:", error);
      return [];
    }
  };

  // Calls right away all the analysis when the component mounts
  useEffect(() => {
    const fetchData = async () => {
      if (selectedCoin) {
        await fetchNarrativeTrading();
      }
    };

    fetchData();
  }, [selectedCoin, fetchNarrativeTrading]); // Include fetchAnalysis as a dependency

  const handleScheduleSubmit = async () => {
    if (
      selectedCoin === null ||
      selectedImage === null ||
      content === null ||
      selectedDate === null ||
      title === null
    ) {
      return Swal.fire({
        icon: "error",
        title: "One or more required fields are missing",
        showConfirmButton: false,
        timer: 1000,
        customClass: "swal",
      });
    }
    setIsSubmitting(true);

    const selectedDateStr = selectedDate.toLocaleString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });

    const cleanedSelectedDate = selectedDateStr.replace(
      " GMT-0300 (Argentina Standard Time)",
      "",
    );

    const coins = selectedCoin
      ? [selectedCoin]
      : await fetchCoinsByCategory(selectedCategory);

    for (const coin of coins) {
      const combinedContent = `Title: ${title}\n${content}`;
      const formDataToSchedule = new FormData();
      formDataToSchedule.append("coinBot", selectedCoin);
      formDataToSchedule.append("content", combinedContent);
      formDataToSchedule.append("scheduledDate", cleanedSelectedDate);
      formDataToSchedule.append("category_name", selectedCategory);

      try {
        const response = await fetch(
          `${config.BASE_URL}/schedule_narrative_post`,
          {
            method: "POST",
            body: formDataToSchedule,
            headers: {
              "X-Api-Key": config.X_API_KEY,
            },
          },
        );

        let responseData = await response.json();

        if (response.ok) {
          Swal.fire({
            icon: "success",
            title: responseData.message,
            showConfirmButton: false,
            timer: 1000,
            customClass: "swal",
          });
          setSelectedCoin(null);
          setIsNarrativeTradingCreated(true);
          setContent(null);
          setSelectedDate(null);
          setSelectedImage([]);
          await fetchNarrativeTrading();
          handleGetJobs();
        } else {
          Swal.fire({
            icon: "error",
            title: "Error scheduling post",
            showConfirmButton: false,
            timer: 1000,
            customClass: "swal",
          });
        }
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "An error occurred",
          text: error.message,
          showConfirmButton: false,
          timer: 1000,
          customClass: "swal",
        });
      } finally {
        setIsSubmitting(false);
      }
    }
  };
  // handles the submit of the three values needed - coin Id, content, and image
  const handleSubmit = async () => {
    if (selectedCoin === null || selectedImage === null || content === null) {
      return Swal.fire({
        icon: "error",
        title: "One or more required fields are missing",
        showConfirmButton: false,
        timer: 1000,
        customClass: "swal",
      });
    }
    setIsSubmitting(true);
    const coins = selectedCoin
      ? [selectedCoin]
      : await fetchCoinsByCategory(selectedCategory);

    for (const coin of coins) {
      const formData = new FormData();
      formData.append("coinBot", selectedCoin);
      formData.append("content", content);
      formData.append("images", selectedImage);
      formData.append("category_name", selectedCategory);

      try {
        const response = await fetch(
          `${config.BASE_URL}/post_narrative_trading`,
          {
            method: "POST",
            body: formData,
            headers: {
              "X-Api-Key": config.X_API_KEY,
            }
          },
        );
        console.log(formData);
        let responseData = await response.json();

        if (response.ok) {
          Swal.fire({
            icon: "success",
            title: responseData.message,
            showConfirmButton: false,
            timer: 1000,
            customClass: "swal",
          });
          setIsNarrativeTradingCreated(true);
          setContent(null);

          await fetchNarrativeTrading();
        } else {
          Swal.fire({
            icon: "error",
            title: "Error creating narrative trading",
            showConfirmButton: false,
            timer: 1000,
            customClass: "swal",
          });
        }
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: error,
          showConfirmButton: false,
          timer: 1000,
          customClass: "swal",
        });
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  useEffect(() => {
    handleGetJobs();
  }, []);

  const handleGetJobs = async () => {
    try {
      const response = await fetch(
        `${config.BASE_URL}/get_narrative_trading_jobs`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "ngrok-skip-browser-warning": "true",
            "X-Api-Key": config.X_API_KEY,
          },
        },
      );

      const data = await response.json();
      console.log("data jobs", data.data.jobs);
      if (response.ok) {
        setScheduledJobs(data.data.jobs); // Actualiza el estado con los trabajos programados
      } else {
        console.error("Error fetching jobs:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching jobs:", error);
    }
  };

  return (
    <div className="analysisMain">
      <Title>Narrative Trading</Title>
      <div className="analysisSubmain">
        <div className="selectors-container"
        >
          <DropdownMenu
            selectedCoin={selectedCoin}
            onSelectCoin={handleSelectCoin}
          />
          <CategoryDropdown
            selectedCategory={selectedCategory}
            onSelectCategory={handleCategorySelect}
          />
        </div>

        <RichTextEditor
          handleImageSelect={handleImageSelect}
          images={selectedImage}
          success={isNarrativeTradingCreated}
          onSuccess={setIsNarrativeTradingCreated}
          onContentChange={handleContentChange}
        />
        <button
          className="submitAnalisys"
          onClick={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Posting..." : "Post"}
        </button>
        <button
          className="postLaterButton"
          onClick={() => setShowPostLaterSection(true)}
        >
          Post Later
        </button>
        {showPostLaterSection && (
          <div className="postLaterSection">
            <hr />
            <p>Set a Title:</p>
            <input
              required
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter post title"
            />
            <hr />
            <p>Choose date and time to post:</p>
            <DatePicker
              selected={selectedDate}
              onChange={handleDateChange}
              showTimeSelect
              timeFormat="HH:mm"
              timeIntervals={1}
              dateFormat="Pp"
              required
              placeholderText="Select date and time"
            />

            <button className="schButton" onClick={handleScheduleSubmit}>
              Schedule Post
            </button>
          </div>
        )}
      </div>
      <AllNarrativeTrading
        items={items}
        fetchNarrativeTrading={fetchNarrativeTrading}
      />
      <GeneralNarrativeTrading
        success={isNarrativeTradingCreated}
        onSuccess={setIsNarrativeTradingCreated}
        fetchNarrativeTrading={fetchNarrativeTrading}
      />
      <div className="analysisSubmain">
        <h3>Scheduled Narrative Trading Posts</h3>
        {scheduledJobs.length > 0 ? (
          scheduledJobs.map((job) => (
            <ScheduledJob
              key={job.id}
              title={title}
              job={job}
              onDelete={deleteScheduled}
            />
          ))
        ) : (
          <NoData message={"No scheduled posts"} />
        )}
      </div>
    </div>
  );
};

export default NarrativeTrading;
