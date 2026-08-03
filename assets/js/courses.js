import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';

const supabaseUrl = 'https://kwrugdbrzrfbmibaccwr.supabase.co';
const supabaseKey = 'sb_publishable_Pf_pB13Hv4ycYmNSiD75XQ_cT0b5eOM';
const supabase = createClient(supabaseUrl, supabaseKey);

const form = document.getElementById('addCourseForm');
const courseContainer = document.getElementById('courseContainer');
const submitBtn = form.querySelector('button[type="submit"]');

// എഡിറ്റ് ചെയ്യാൻ പോകുന്ന കോഴ്‌സിന്റെ ID സൂക്ഷിക്കാൻ ഒരു വേരിയബിൾ
let editingId = null; 

document.addEventListener('DOMContentLoaded', fetchCourses);

form.addEventListener('submit', async (e) => {
    e.preventDefault();
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

    if (editingId) {
        // നിലവിലുള്ള കോഴ്‌സ് അപ്ഡേറ്റ് ചെയ്യാൻ (Edit)
        const { error } = await supabase.from('courses').update(courseData).eq('id', editingId);
        if (error) {
            alert("Error updating course: " + error.message);
        } else {
            alert("Course updated successfully!");
            form.reset();
            editingId = null; // എഡിറ്റ് മോഡ് ഓഫാക്കുന്നു
            submitBtn.textContent = 'Save Course Curriculum';
            fetchCourses();
        }
    } else {
        // പുതിയ കോഴ്‌സ് ആഡ് ചെയ്യാൻ (Insert)
        const { error } = await supabase.from('courses').insert([courseData]);
        if (error) {
            alert("Error saving course: " + error.message);
        } else {
            alert("Course curriculum added successfully!");
            form.reset();
            fetchCourses();
        }
    }
    
    if(!editingId) {
        submitBtn.textContent = 'Save Course Curriculum'; 
    }
    submitBtn.disabled = false;
});

async function fetchCourses() {
    courseContainer.innerHTML = '<p style="text-align: center; color: #64748b; width: 100%;">Loading courses...</p>';

    const { data: courses, error } = await supabase
        .from('courses')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        courseContainer.innerHTML = `<p style="color:red; text-align: center; width: 100%;">Error: ${error.message}</p>`;
        return;
    }

    courseContainer.innerHTML = ''; 
    
    if (courses.length === 0) {
        courseContainer.innerHTML = '<p style="text-align: center; color: #64748b; width: 100%;">No courses found. Create a new one above.</p>';
        return;
    }

    // എഡിറ്റ് ചെയ്യുമ്പോൾ ഡാറ്റ എടുക്കാൻ വേണ്ടി വിവരങ്ങൾ ഒരു ഗ്ലോബൽ വേരിയബിളിൽ സേവ് ചെയ്യുന്നു
    window.allCourses = courses;

    courses.forEach(course => {
        const statusClass = course.status === 'Active' ? 'status-active' : 'status-draft';
        const modulesHTML = course.sub_modules ? `<div class="sub-modules-box"><strong>Modules:</strong> ${course.sub_modules}</div>` : '';

        const card = document.createElement('div');
        card.className = 'course-card';
        // HTML ഫയൽ മാറ്റാതെ തന്നെ പുതിയ ബട്ടണുകൾക്ക് ഡിസൈൻ നൽകുന്നു
        card.innerHTML = `
            <span class="status-badge ${statusClass}" style="position: absolute; top: 15px; right: 15px;">${course.status}</span>
            <h3 class="course-title">${course.course_name}</h3>
            
            <div class="course-meta">
                <div>🎓 ${course.certification_type}</div>
                <div>⏱️ ${course.duration} (${course.total_hours} Hrs)</div>
                <div>💰 ₹${course.total_fee}</div>
                <div>👨‍🏫 ${course.instructor_name}</div>
                <div>🪑 ${course.capacity} Seats</div>
            </div>
            
            ${modulesHTML}
            
            <div style="display: flex; gap: 10px; margin-top: 15px; border-top: 1px solid #e2e8f0; padding-top: 15px; justify-content: flex-end;">
                <button class="btn-edit" data-id="${course.id}" style="background: #e0f2fe; color: #0284c7; border: none; padding: 6px 15px; border-radius: 6px; font-size: 13px; cursor: pointer; font-weight: 600; transition: 0.2s;">Edit</button>
                <button class="btn-delete" data-id="${course.id}" style="background: #fee2e2; color: #dc2626; border: none; padding: 6px 15px; border-radius: 6px; font-size: 13px; cursor: pointer; font-weight: 600; transition: 0.2s;">Delete</button>
            </div>
        `;
        courseContainer.appendChild(card);
    });

    // എഡിറ്റ് ബട്ടണിൽ ക്ലിക്ക് ചെയ്യുമ്പോൾ ഉള്ള പ്രവർത്തനം
    document.querySelectorAll('.btn-edit').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const courseId = e.target.getAttribute('data-id');
            const courseToEdit = window.allCourses.find(c => c.id === courseId);
            
            if (courseToEdit) {
                document.getElementById('courseName').value = courseToEdit.course_name;
                document.getElementById('certType').value = courseToEdit.certification_type;
                document.getElementById('duration').value = courseToEdit.duration;
                document.getElementById('totalHours').value = courseToEdit.total_hours;
                document.getElementById('totalFee').value = courseToEdit.total_fee;
                document.getElementById('instructorName').value = courseToEdit.instructor_name;
                document.getElementById('capacity').value = courseToEdit.capacity;
                document.getElementById('courseStatus').value = courseToEdit.status;
                document.getElementById('subModules').value = courseToEdit.sub_modules || '';
                
                editingId = courseId; // ID സെറ്റ് ചെയ്യുന്നു
                submitBtn.textContent = 'Update Course Curriculum'; // സേവ് ബട്ടൺ പേര് മാറ്റുന്നു
                window.scrollTo({ top: 0, behavior: 'smooth' }); // മുകളിലേക്ക് ഫോമിലേക്ക് സ്ക്രോൾ ചെയ്യുന്നു
            }
        });
    });

    // ഡിലീറ്റ് ബട്ടൺ പ്രവർത്തനം
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
                    fetchCourses(); 
                }
            }
        });
    });
}
