// Supabase Configuration (നിങ്ങൾ നൽകിയ വിവരങ്ങൾ ഉൾപ്പെടുത്തിയിരിക്കുന്നു)
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';

const supabaseUrl = 'https://kwrugdbrzrfbmibaccwr.supabase.co';
const supabaseKey = 'sb_publishable_Pf_pB13Hv4ycYmNSiD75XQ_cT0b5eOM';
const supabase = createClient(supabaseUrl, supabaseKey);

// DOM Elements
const form = document.getElementById('addCourseForm');
const courseContainer = document.getElementById('courseContainer');

// പേജ് ലോഡ് ആകുമ്പോൾ കോഴ്‌സുകൾ വലിച്ചെടുക്കാൻ
document.addEventListener('DOMContentLoaded', fetchCourses);

// പുതിയ കോഴ്‌സ് ഫോം സബ്മിറ്റ് ചെയ്യുമ്പോൾ
form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const submitBtn = form.querySelector('button[type="submit"]');
    submitBtn.textContent = 'Saving...'; 
    submitBtn.disabled = true;

    const courseData = {
        course_name: document.getElementById('courseName').value,
        certification_type: document.getElementById('certType').value,
        duration: document.getElementById('duration').value,
        total_hours: document.getElementById('totalHours').value,
        total_fee: document.getElementById('totalFee').value,
        instructor_name: document.getElementById('instructorName').value,
        capacity: document.getElementById('capacity').value,
        status: document.getElementById('courseStatus').value,
        sub_modules: document.getElementById('subModules').value
    };

    const { error } = await supabase.from('courses').insert([courseData]);

    if (error) {
        alert("Error saving course: " + error.message);
    } else {
        alert("Course curriculum added successfully!");
        form.reset();
        fetchCourses(); // പുതിയ ഡാറ്റ ഉൾപ്പെടെ റിഫ്രഷ് ചെയ്യാൻ
    }
    
    submitBtn.textContent = 'Save Course Curriculum'; 
    submitBtn.disabled = false;
});

// ഡാറ്റാബേസിൽ നിന്നും കോഴ്‌സുകൾ എടുത്ത് സ്ക്രീനിൽ കാണിക്കാൻ
async function fetchCourses() {
    courseContainer.innerHTML = '<p style="text-align: center; color: #64748b; width: 100%;">Loading...</p>';

    const { data: courses, error } = await supabase
        .from('courses')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        courseContainer.innerHTML = `<p style="color:red; text-align: center; width: 100%;">Error loading courses: ${error.message}</p>`;
        return;
    }

    courseContainer.innerHTML = ''; 
    
    if (courses.length === 0) {
        courseContainer.innerHTML = '<p style="text-align: center; color: #64748b; width: 100%;">No courses found. Create a new one above.</p>';
        return;
    }

    courses.forEach(course => {
        const statusClass = course.status === 'Active' ? 'status-active' : 'status-draft';
        const modulesHTML = course.sub_modules ? `<div class="sub-modules-box"><strong>Modules:</strong> ${course.sub_modules}</div>` : '';

        const card = document.createElement('div');
        card.className = 'course-card';
        card.innerHTML = `
            <span class="status-badge ${statusClass}">${course.status}</span>
            <h3 class="course-title">${course.course_name}</h3>
            
            <div class="course-meta">
                <div>🎓 ${course.certification_type}</div>
                <div>⏱️ ${course.duration} (${course.total_hours} Hrs)</div>
                <div>💰 ₹${course.total_fee}</div>
                <div>👨‍🏫 ${course.instructor_name}</div>
                <div>🪑 ${course.capacity} Seats</div>
            </div>
            
            ${modulesHTML}
            
            <button class="btn-delete" data-id="${course.id}">Delete</button>
        `;
        courseContainer.appendChild(card);
    });

    // Delete ബട്ടണുകൾക്ക് ആക്ഷൻ നൽകാൻ
    document.querySelectorAll('.btn-delete').forEach(btn => {
        btn.addEventListener('click', async (e) => {
            const courseId = e.target.getAttribute('data-id');
            if (confirm('Are you sure you want to delete this course?')) {
                e.target.textContent = 'Deleting...';
                const { error } = await supabase.from('courses').delete().eq('id', courseId);
                
                if (error) {
                    alert('Error deleting course: ' + error.message);
                    e.target.textContent = 'Delete';
                } else {
                    fetchCourses(); // ഡിലീറ്റ് ചെയ്ത ശേഷം ലിസ്റ്റ് റിഫ്രഷ് ചെയ്യാൻ
                }
            }
        });
    });
}
