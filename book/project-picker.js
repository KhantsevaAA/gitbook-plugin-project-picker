function projectPickerGrid(gitbook, elem, maxColumns, projectsData) {
    var CurAddr = location.href.substr(gitbook.state.root.length);
    var sharp = CurAddr.indexOf("#");
    var CurAddrNoAnchor = (sharp == -1) ? CurAddr : CurAddr.substr(0, sharp);
    
    var table = $("<table>");
    var ins = 0;
    var maxRows = Math.ceil(projectsData.length / maxColumns);
    
    for (var i = 0; i < maxRows; i++) {
        var r = $("<tr>");
        for (var ii = 0; (i * maxColumns + ii < projectsData.length) && (ii < maxColumns); ii++) {
            var c = $("<td>");
            var l = $("<a>");
            
            // Формируем путь: текущий язык + путь проекта
            var currentLang = gitbook.state.innerLanguage || 'ru';
            var projectPath = projectsData[ins][2];
            var newPath = '/' + currentLang + projectPath;
            
            // Сохраняем текущую страницу
            if (CurAddrNoAnchor && CurAddrNoAnchor !== '/') {
                var currentPage = CurAddrNoAnchor.split('/').pop();
                if (currentPage && currentPage !== '') {
                    newPath = newPath + currentPage;
                }
            }
            
            l.attr("href", gitbook.state.bookRoot.replace(/([^\/])$/, "$1/") + currentLang + projectPath);
            l.attr("data-project", projectsData[ins][0]);
            l.html(projectsData[ins][1]);
            c.append(l);
            r.append(c);
            ins++;
        }
        table.append(r);
    }
    elem.append(table);
}

require(["gitbook", "jQuery"], function(gitbook, $) {
    gitbook.events.bind("start", function(e, config) {
        var opts = config["project-picker"];
        
        if (!opts || !opts.projects || opts.projects.length === 0) return;
        
        // Создаем кнопку через стандартный API тулбара
        gitbook.toolbar.createButton({
            icon: "fa fa-folder-open",
            label: "Select project",
            className: "project-picker",
            dropdown: []
        });
        
        $(function() {
            var DDMenu_selector = ".project-picker .dropdown-menu";
            
            // При клике на кнопку заполняем выпадающее меню
            $(document).one("click", ".project-picker .btn", function(e) {
                var maxColumns = opts["grid-columns"] || 3;
                var projects = opts.projects;
                
                var elem = $(DDMenu_selector);
                elem.empty(); // Очищаем перед заполнением
                elem.addClass("project-picker-grid");
                
                projectPickerGrid(gitbook, elem, maxColumns, projects);
                elem.trigger("parsedContent");
            });
        });
    });
});
