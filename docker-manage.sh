#!/bin/bash

# FabManage Docker Management Script
ACTION=${1:-start}

echo "🐳 FabManage Docker Management"

case $ACTION in
    "start")
        echo "🚀 Starting FabManage services..."
        docker-compose up -d
        echo "✅ Services started! Check status with: docker-compose ps"
        echo "🌐 Frontend: http://localhost:3000"
        echo "🔧 Backend API: http://localhost:3001/api/materials"
        ;;
    
    "stop")
        echo "🛑 Stopping FabManage services..."
        docker-compose down
        echo "✅ Services stopped!"
        ;;
    
    "restart")
        echo "🔄 Restarting FabManage services..."
        docker-compose restart
        echo "✅ Services restarted!"
        ;;
    
    "status")
        echo "📊 Service Status:"
        docker-compose ps
        ;;
    
    "logs")
        echo "📝 Recent logs:"
        docker-compose logs --tail=20
        ;;
    
    "build")
        echo "🔨 Building Docker images..."
        docker-compose build --no-cache
        echo "✅ Images built!"
        ;;
    
    "clean")
        echo "🧹 Cleaning up Docker resources..."
        docker-compose down --volumes --remove-orphans
        docker system prune -f
        echo "✅ Cleanup completed!"
        ;;
    
    *)
        echo "❌ Unknown action: $ACTION"
        echo "💡 Usage: $0 [start|stop|restart|status|logs|build|clean]"
        exit 1
        ;;
esac

echo ""
echo "💡 Usage: $0 [start|stop|restart|status|logs|build|clean]"
