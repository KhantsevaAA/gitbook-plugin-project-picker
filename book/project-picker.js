require(['gitbook'], function(gitbook) {
  gitbook.events.bind('start', function(e, config) {
    var projectsConfig = config['project-picker'];
    if (!projectsConfig) return;
    
    var projects = projectsConfig.projects;
    var defaultProject = projectsConfig.default;
    var gridColumns = projectsConfig['grid-columns'] || 3;
    
    if (!projects || projects.length === 0) return;
    
    // Создаем HTML для модального окна выбора проекта
    var modalHtml = '<div class="project-picker-modal">' +
      '<div class="project-picker-modal-content">' +
      '<div class="project-picker-header">Выберите проект</div>' +
      '<div class="project-picker-grid" style="grid-template-columns: repeat(' + gridColumns + ', 1fr);">';
    
    projects.forEach(function(project) {
      var id = project[0];
      var name = project[1];
      var path = project[2];
      
      modalHtml += '<a href="#" class="project-picker-item" data-project-id="' + id + '" data-project-path="' + path + '">' +
        '<div class="project-picker-item-name">' + name + '</div>' +
        '</a>';
    });
    
    modalHtml += '</div></div></div>';
    
    // Добавляем модальное окно в DOM
    $('body').append(modalHtml);
    
    // Создаем кнопку в тулбаре (как в language-picker - иконка)
    var projectButton = '<a href="#" class="btn pull-right project-picker-button" style="padding: 0 5px;">' +
      '<i class="fa fa-folder-open"></i>' +
      '</a>';
    
    // Вставляем кнопку после language-picker, если он есть
    var langPickerButton = $('.language-picker-button');
    if (langPickerButton.length) {
      langPickerButton.after(projectButton);
    } else {
      $('.book-header .btn-group').append(projectButton);
    }
    
    // Определяем текущий проект из URL
    var currentPath = window.location.pathname;
    var currentProjectId = null;
    var currentProjectPath = null;
    
    projects.forEach(function(project) {
      var id = project[0];
      var path = project[2];
      if (currentPath.includes(path)) {
        currentProjectId = id;
        currentProjectPath = path;
      }
    });
    
    // Если проект не определен, но есть default
    if (!currentProjectId && defaultProject) {
      var defaultProjectData = projects.find(function(p) { return p[0] === defaultProject; });
      if (defaultProjectData) {
        currentProjectPath = defaultProjectData[2];
      }
    }
    
    // Обработчик клика по кнопке
    $('.project-picker-button').on('click', function(e) {
      e.preventDefault();
      $('.project-picker-modal').show();
    });
    
    // Обработчик выбора проекта
    $('.project-picker-item').on('click', function(e) {
      e.preventDefault();
      var projectPath = $(this).data('project-path');
      var currentLang = currentPath.split('/')[1] || 'ru'; // Определяем текущий язык
      
      // Формируем новый путь: /{lang}/{projectPath}
      var newPath = '/' + currentLang + projectPath;
      
      // Сохраняем текущую страницу внутри проекта
      var currentPage = currentPath.substring(currentPath.lastIndexOf('/') + 1);
      if (currentPage && !currentPage.includes('.html')) {
        currentPage = currentPage + '.html';
      }
      
      // Если страница существует в новом проекте, переходим на неё
      if (currentPage && currentPage !== 'index.html') {
        newPath = newPath + currentPage;
      }
      
      window.location.href = newPath;
    });
    
    // Закрытие модального окна при клике вне его
    $(document).on('click', function(e) {
      if (!$(e.target).closest('.project-picker-modal-content').length && 
          !$(e.target).closest('.project-picker-button').length) {
        $('.project-picker-modal').hide();
      }
    });
  });
});